package by.kursovaya.services;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import lombok.SneakyThrows;

@Service
public class ResourceService {
    @Autowired
    private ResourceLoader resourceLoader;

    public Resource getImageAsResource(String path) {
        return resourceLoader.getResource("classpath:" + path);
    }

    @SneakyThrows
    public String saveImageAsResource(String base64, String folderPath, String filename) {
        String[] tokens = base64.split(",");
        String extension = null;

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

        byte[] data = Base64Utils.decodeFromString(tokens[1]);

        File file = new File("D:\\Visual Studio Code Projects\\Kursovaya5sem\\backend\\src\\main\\resources\\static\\car-images\\" + filename + extension);

        OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file));
        outputStream.write(data);
        outputStream.close();

        return filename + extension;
    }
}
