class Utils {
    getBodyTypes() { 
        return ["Внедорожник 3 дв.", "Внедорожник 5 дв.", "Кабриолет", "Купе", "Легковой фургон", "Лимузин", "Лифтбек",
                          "Микроавтобус грузопассажирский", "Микроавтобус пассажирский", "Минивен", "Пикап", "Родстер", "Седан",
                          "Универсал", "Хэтчбек 3 дв.", "Хэтчбек 5 дв.", "Другой"];
    }

    getWheelDriveTypes() { 
        return ["Передний", "Задний", "Подключаемый полный", "Постоянный полный"];
    }

    getBodyColors() {
        return ["Белый", "Бордовый", "Желтый", "Зеленый", "Коричневый", "Красный", "Оранжевый", "Серебристый", "Серый",
                           "Синий", "Фиолетовый", "Черный", "Другой"];
    }

    getInteriorColors() { 
        return ["Светлый", "Темный", "Комбинированный"];
    }

    getInteriorMaterials() { 
        return ["Натуральная кожа", "Искусственная кожа", "Ткань", "Велюр", "Алькантара", "Комбинированный"];
    }

    getEngineTypes() {
        return ["Бензиновый", "Дизельный", "Электро"];
    }

    getTransmissionTypes() {
        return ["Автоматическая", "Механическая"];
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }

    generateYearArray(startYear) {
        var years = [];
        var currentYear = new Date().getFullYear();
        
        for(let i = 0; i <= currentYear - startYear; i++) {
            years.push(startYear + i);
        }
    
        years.reverse();
    
        return years;
    }
  
    generateEngineVolumeArray(startVolume, endVolume) {
        var engineVolumes = [];
    
        for(let i = startVolume; i <= endVolume; i += 0.1) {
            engineVolumes.push(i.toFixed(1));
        }
    
        engineVolumes.reverse();
    
        return engineVolumes;
    }

    generateWorkingHours() {
        var workingHours = [];
        
        for(let i = 0; i < 24; i++) {
            workingHours.push((i < 10 ? "0" + i : i) + ":00");
            workingHours.push((i < 10 ? "0" + i : i) + ":30");
        }

        return workingHours;
    }

    compareTime(firstTime, secondTime) {
        if (secondTime === null) {
            return -2;
        }
        if (firstTime === null) {
            return 2;
        }

        if (firstTime === secondTime) {
            return 0;
        }

        let firstTimeHours = Number.parseInt(firstTime.split(':')[0]);
        let firstTimeMinutes = Number.parseInt(firstTime.split(':')[1]);
        let secondTimeHours = Number.parseInt(secondTime.split(':')[0]);
        let secondTimeMinutes = Number.parseInt(secondTime.split(':')[1]);

        console.log(firstTimeHours);
        console.log(firstTimeMinutes);
        console.log(secondTimeHours);
        console.log(secondTimeMinutes);
        
        if (firstTimeHours < secondTimeHours && firstTimeMinutes === secondTimeMinutes) {
            return 1;
        }

        if (firstTimeHours > secondTimeHours && firstTimeMinutes === secondTimeMinutes) {
            return -1;
        }

        

        if (secondTimeHours === firstTimeHours) {
            if (firstTimeMinutes < secondTimeMinutes) {
                return 1;
            }
            if (firstTimeMinutes > secondTimeMinutes) {
                return -1;
            }
        }

        if (firstTimeHours < secondTimeHours) {
            return 1;
        }

        if (firstTimeHours > secondTimeHours) {
            return -1;
        }

        return 3;
    }
}

export default new Utils();