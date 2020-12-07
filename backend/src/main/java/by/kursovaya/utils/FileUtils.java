package by.kursovaya.utils;

import java.util.Random;

public class FileUtils implements Utils {
    public String generateFilename(Integer lowerBound, Integer higherBound) {
        return Integer.toString(new Random().nextInt(higherBound - lowerBound + 1));
    }

    @Override
    public void printUtilsInformation() {
        System.out.println("Класс Utils для файлов.");
    }
}
