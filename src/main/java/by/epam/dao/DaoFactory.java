package by.epam.dao;


public class DaoFactory {
    private static final DaoFactory instance = new DaoFactory();
    private final FileWorker fileWorker = new FileWorker();

    private DaoFactory() {}

    public static DaoFactory getInstance() {
        return instance;
    }

    public FileWorker getFileWorker() {
        return fileWorker;
    }

}
