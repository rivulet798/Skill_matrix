package by.epam.service;

import by.epam.beans.Category;

import java.util.List;

public interface SkillService {
    List<Category> getCategories();
    List<Category> getSubCategories(String categoryName);
    Category getCategoryByName(String categoryName);
    List<Category> searchCategoriesByPartOfName(String partOfName);
    boolean editCategory(String oldCategoryName, String editCategoryName);

}
