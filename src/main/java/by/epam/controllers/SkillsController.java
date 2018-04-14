package by.epam.controllers;

import by.epam.beans.Category;
import by.epam.service.SkillService;
import by.epam.service.SkillServiceImpl;
import by.epam.service.factory.ServiceFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Controller
// мапим наш REST на /myservice
@RequestMapping(value = "/skills")

public class SkillsController {
    private ObjectMapper mapper = new ObjectMapper();

    public SkillsController(){}

    // этот метод будет принимать время методом GET и на его основе
    // отвечать клиенту
    @RequestMapping(value = "", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
    @ResponseBody
    public String getCategories() {
        try {
            ServiceFactory serviceFactory = ServiceFactory.getInstance();
            SkillService skillService = serviceFactory.getSkillService();
            List<Category> categories = skillService.getCategories();
            return mapper.writeValueAsString(categories);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

    @RequestMapping(value = "/category/{categoryName}/subCategories", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
    @ResponseBody
    public String getSubCategories(@PathVariable String categoryName) {
        try {
            ServiceFactory serviceFactory = ServiceFactory.getInstance();
            SkillService skillService = serviceFactory.getSkillService();
            List<Category> subCategories = skillService.getSubCategories(categoryName);
            return mapper.writeValueAsString(subCategories);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

    @RequestMapping(value = "/category/search/{inputInitialValue}", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
    @ResponseBody
    public String searchCategoriesByPartOfName(@PathVariable String inputInitialValue) {
        try {
            ServiceFactory serviceFactory = ServiceFactory.getInstance();
            SkillService skillService = serviceFactory.getSkillService();
            List<Category> categories = skillService.searchCategoriesByPartOfName(inputInitialValue);
            return mapper.writeValueAsString(categories);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

    @RequestMapping(value = "/category/{editName}", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
    @ResponseBody
    public String getCategoryByName(@PathVariable String editName) {
        try {
            ServiceFactory serviceFactory = ServiceFactory.getInstance();
            SkillService skillService = serviceFactory.getSkillService();
            Category category = skillService.getCategoryByName(editName);
            return mapper.writeValueAsString(category);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

    @RequestMapping(value = "/category/{categoryName}", method = RequestMethod.PUT, produces = "application/json;charset=utf-8")
    @ResponseBody
    public String editCategoryByName(@PathVariable String categoryName, @RequestBody String editCategoryName) {
        try {
            JSONObject json = new JSONObject(editCategoryName);
            editCategoryName = json.get("editCategoryName").toString();
            ServiceFactory serviceFactory = ServiceFactory.getInstance();
            SkillService skillService = serviceFactory.getSkillService();
            boolean result = skillService.editCategory(categoryName, editCategoryName);
            return mapper.writeValueAsString(result);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

    @RequestMapping(value = "/category/{categoryName}", method = RequestMethod.DELETE, produces = "application/json;charset=utf-8")
    @ResponseBody
    public String deleteCategoryByName(@PathVariable String categoryName) {
        try {
            ServiceFactory serviceFactory = ServiceFactory.getInstance();
            SkillService skillService = serviceFactory.getSkillService();
            boolean result = skillService.deleteCategory(categoryName);
            return mapper.writeValueAsString(result);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

    @RequestMapping(value = "/category/{categoryName}", method = RequestMethod.POST, produces = "application/json;charset=utf-8")
    @ResponseBody
    public String addSubCategory(@PathVariable String categoryName, @RequestBody String subCategoryName) {
        try {
            JSONObject json = new JSONObject(subCategoryName);
            subCategoryName = json.get("subCategoryName").toString();
            ServiceFactory serviceFactory = ServiceFactory.getInstance();
            SkillService skillService = serviceFactory.getSkillService();
            boolean result = skillService.addSubCategory(categoryName, subCategoryName);
            return mapper.writeValueAsString(result);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

}
