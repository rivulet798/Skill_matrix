package by.epam.service.factory;

import by.epam.service.SkillService;
import by.epam.service.SkillServiceImpl;

public class ServiceFactory {
    private static final ServiceFactory instance = new ServiceFactory();
    private final SkillService skillService = new SkillServiceImpl();

    private ServiceFactory() {}

    public static ServiceFactory getInstance() {
        return instance;
    }

    public SkillService getSkillService() {
        return skillService;
    }

}
