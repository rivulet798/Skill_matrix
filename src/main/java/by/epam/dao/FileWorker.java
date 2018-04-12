package by.epam.dao;

import by.epam.beans.Category;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;


import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class FileWorker implements Serializable{
    private static Logger logger = Logger.getLogger(FileWorker.class);
    private File file;
    private Category category;
    private Category possibleParent;
    private Category subcategory;
    private List<Category> categories;

    public List<Category> parse(String fileName) {
        int level = 0;
        categories = new ArrayList<>();

        ClassLoader classLoader = this.getClass().getClassLoader();
        this.file = new File(classLoader.getResource(fileName).getFile());

        try(FileInputStream fileInputStream = new FileInputStream(file.getPath())) {

            Workbook workbook = new HSSFWorkbook(fileInputStream);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator rowIterator = sheet.rowIterator();
            String infoFromFile;

            while(rowIterator.hasNext()) {
                HSSFRow row = (HSSFRow) rowIterator.next();
                if(row.getRowNum() == 0){
                    continue;
                }
                Iterator cellIterator = row.cellIterator();
                while(cellIterator.hasNext())
                {
                    HSSFCell cell = (HSSFCell) cellIterator.next();
                    int columnIndex = cell.getColumnIndex();
                    infoFromFile = getCellText(cell);
                    if(columnIndex == 0) {
                        category = new Category();
                        category.setName(infoFromFile);
                        category.setLevel(level);
                        category.setParentCategory(category);
                        categories.add(category);
                        possibleParent = null;
                    } else if (level == columnIndex){
                        subcategory = new Category();
                        subcategory.setName(infoFromFile);
                        subcategory.setLevel(level);
                        if(possibleParent == null) {
                            category.getSubCategories().add(subcategory);
                            subcategory.setParentCategory(category);
                        } else{
                            while(!(possibleParent.getLevel() == level-1)){
                                possibleParent = possibleParent.getParentCategory();
                            }
                            possibleParent.getSubCategories().add(subcategory);
                            subcategory.setParentCategory(possibleParent);
                        }
                        possibleParent = subcategory;
                    } else if(level == columnIndex-1){
                        ++level;
                        subcategory = new Category();
                        subcategory.setName(infoFromFile);
                        subcategory.setLevel(level);
                        if (possibleParent == null) {
                            category.getSubCategories().add(subcategory);
                            subcategory.setParentCategory(category);
                        } else {
                            possibleParent.getSubCategories().add(subcategory);
                            subcategory.setParentCategory(possibleParent);
                        }
                        possibleParent = subcategory;
                    } else if(columnIndex < level){
                        level = columnIndex;
                        subcategory = new Category();
                        subcategory.setName(infoFromFile);
                        subcategory.setLevel(level);
                        if(possibleParent == null) {
                            category.getSubCategories().add(subcategory);
                            subcategory.setParentCategory(category);
                        } else{
                            while(!(possibleParent.getLevel() == level-1)){
                                possibleParent = possibleParent.getParentCategory();
                            }
                            possibleParent.getSubCategories().add(subcategory);
                            subcategory.setParentCategory(possibleParent);
                        }
                        possibleParent = subcategory;
                    }
                }
            }
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
        System.out.println(categories);
        return categories;
    }

//    public List<String> readFile(String fileName) throws IOException {
//        ClassLoader classLoader = this.getClass().getClassLoader();
//        this.file = new File(classLoader.getResource(fileName).getFile());
//        try(FileInputStream fileInputStream = new FileInputStream(file.getPath())) {
//            Workbook workbook = new HSSFWorkbook(fileInputStream);
//            List<String> data = new ArrayList<>();
//            String infoFromFile;
//            for(Row row : workbook.getSheetAt(0)){
//                int rowNumber = row.getRowNum();
//                if(rowNumber == 0){
//                    continue;
//                }
//                else {
//                    for (Cell cell : row) {
//                        int columnIndex = cell.getColumnIndex();
//                        CellReference cellRef = new CellReference(row.getRowNum(), cell.getColumnIndex());
//                        infoFromFile = getCellText(cell);
//                        data.add(cellRef.formatAsString() + " " + infoFromFile);
//                    }
//                }
//            }
//            return data;
//        }
//    }

    private static String getCellText(Cell cell){
        String result = "";

        switch (cell.getCellType()){
            case Cell.CELL_TYPE_STRING:
                result = cell.getRichStringCellValue().getString();
                break;
            case Cell.CELL_TYPE_NUMERIC:
                if(DateUtil.isCellDateFormatted(cell)){
                    result = cell.getDateCellValue().toString();
                } else {
                    result = Double.toString(cell.getNumericCellValue());
                }
                break;
            case Cell.CELL_TYPE_BOOLEAN:
                result = Boolean.toString(cell.getBooleanCellValue());
                break;
            case Cell.CELL_TYPE_FORMULA:
                result = cell.getCellFormula().toString();
                break;
            default:
                break;
        }

        return result;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public boolean editCategory(String oldCategoryName, String editCategoryName){

        try(FileInputStream fileInputStream = new FileInputStream(file.getPath())) {
            Workbook workbook = new HSSFWorkbook(fileInputStream);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator rowIterator = sheet.rowIterator();
            String infoFromFile;

            while(rowIterator.hasNext()) {
                HSSFRow row = (HSSFRow) rowIterator.next();
                Iterator cellIterator = row.cellIterator();
                while(cellIterator.hasNext())
                {
                    HSSFCell cell = (HSSFCell) cellIterator.next();
                    int columnIndex = cell.getColumnIndex();
                    infoFromFile = getCellText(cell);
                    if(infoFromFile.equals(oldCategoryName)){
                        System.out.println("MIII NASHLIIIII");
                        cell.setCellValue(editCategoryName);
                        try(FileOutputStream fileOutputStream = new FileOutputStream(file.getPath())) {
                            workbook.write(fileOutputStream);
                        }
                        parse("SkillMatrix.xls");
                        return true;
                    }
                }

            }

        } catch (FileNotFoundException e) {
            logger.error(e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
        return false;
    }
}
