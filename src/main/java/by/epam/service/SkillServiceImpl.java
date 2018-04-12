package by.epam.service;

import by.epam.beans.Category;
import by.epam.dao.DaoFactory;
import by.epam.dao.FileWorker;

import java.util.ArrayList;
import java.util.List;

public class SkillServiceImpl implements SkillService {

    @Override
    public List<Category> getCategories() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        FileWorker fileWorker = daoFactory.getFileWorker();
        List<Category> categories = fileWorker.parse("SkillMatrix.xls");
        return categories;
    }

    @Override
    public List<Category> getSubCategories(String categoryName) {
        DaoFactory daoFactory = DaoFactory.getInstance();
        FileWorker fileWorker = daoFactory.getFileWorker();
        List<Category> categories = fileWorker.getCategories();
        categoryName = categoryName.replace("@","/");
        Category category = findCategoryByName(categoryName, categories);
        return category.getSubCategories();
    }

    @Override
    public Category getCategoryByName(String categoryName) {
        DaoFactory daoFactory = DaoFactory.getInstance();
        FileWorker fileWorker = daoFactory.getFileWorker();
        List<Category> categories = fileWorker.getCategories();
        categoryName = categoryName.replace("@","/");
        return findCategoryByName(categoryName, categories);
    }

    private Category findCategoryByName(String categoryName, List<Category> categories){
        Category categoryFound = null;
        for(Category category : categories){
            if(category.getName().equals(categoryName)){
                categoryFound = category;
                return categoryFound;
            } else {
                List<Category> subCategories = category.getSubCategories();
                if(subCategories != null) {
                    if(findCategoryByName(categoryName, subCategories) != null){
                        categoryFound = findCategoryByName(categoryName, subCategories);
                    }
                }
            }
        }
        return categoryFound;
    }

    @Override
    public List<Category> searchCategoriesByPartOfName(String partOfName) {
        DaoFactory daoFactory = DaoFactory.getInstance();
        FileWorker fileWorker = daoFactory.getFileWorker();
        List<Category> categories = fileWorker.getCategories();
        partOfName = partOfName.replace("@","/");
        return findCategoriesByPartOfName(partOfName, categories);
    }

    @Override
    public boolean editCategory(String oldCategoryName, String editCategoryName) {
        DaoFactory daoFactory = DaoFactory.getInstance();
        FileWorker fileWorker = daoFactory.getFileWorker();
        oldCategoryName = oldCategoryName.replace("@","/");
        editCategoryName = editCategoryName.replace("@","/");
        return fileWorker.editCategory(oldCategoryName, editCategoryName);
    }

    private List<Category> findCategoriesByPartOfName(String partOfName, List<Category> categories){
        List<Category> categoriesFound = new ArrayList<>();
        partOfName = partOfName.toLowerCase();
        for(Category category : categories){
            String categoryNameWithoutRegister = category.getName().toLowerCase();
            if(categoryNameWithoutRegister.contains(partOfName)){
                categoriesFound.add(category);
            }
            List<Category> subCategories = category.getSubCategories();
            if(subCategories != null) {
                if(findCategoriesByPartOfName(partOfName, subCategories) != null){
                    categoriesFound.addAll(findCategoriesByPartOfName(partOfName, subCategories));
                }
            }
        }
        return categoriesFound;
    }

}
