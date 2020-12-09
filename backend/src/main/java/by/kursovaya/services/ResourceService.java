package by.kursovaya.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import lombok.SneakyThrows;

@Service
public class ResourceService {
    final static String FILE_FOLDER_PATH = "./files/";
    final static String IMAGES_FOLDER_PATH = FILE_FOLDER_PATH + "images/";
    final static String CHECK_FOLDER_PATH = FILE_FOLDER_PATH + "checks/";
    final static Integer FILENAME_LENGTH = 10;

    public FileSystemResource getImageAsResource(String filename) {
        return new FileSystemResource(new File(IMAGES_FOLDER_PATH + filename));
    }

    @SneakyThrows
    public String saveImageAsResource(String base64) {
        String[] tokens = base64.split(",");

        String filename = StringUtils.EMPTY;
        String extension = StringUtils.EMPTY;

        switch(tokens[0]) {
            case "data:image/jpeg;base64":
                extension = ".jpeg";
                break;
            case "data:image/png;base64":
                extension = ".png";
                break;
            default:
                extension = ".jpg";
                break;
        }

        do {
            filename = generateFilename(extension); 
        }
        while(new File(IMAGES_FOLDER_PATH + filename).exists());

        byte[] data = Base64Utils.decodeFromString(tokens[1]);

        try (FileOutputStream fileOutputStream = new FileOutputStream(IMAGES_FOLDER_PATH + filename)) {
            fileOutputStream.write(data);
        }

        return filename;
    }

    @SneakyThrows
    public void saveCheckAsResource(String check) {
        String filename = new SimpleDateFormat("yyyy-MM-dd HH_mm_ss").format(new Date()) + ".txt";

        try(FileWriter fileWriter = new FileWriter(CHECK_FOLDER_PATH + filename, false)) {
            fileWriter.write(check);
        }
    }

    private String generateFilename(String extension) {
        return RandomStringUtils.randomAlphanumeric(FILENAME_LENGTH) + extension;
    }
}
