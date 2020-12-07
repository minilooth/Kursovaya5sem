package by.kursovaya.utils;

public class SpringUtilsFactory implements UtilsFactory {
    @Override
    public FileUtils createFileUtils() {
        return new FileUtils();
    }

    @Override
    public DateUtils createDateUtils() {
        return new DateUtils();
    }
}
