package by.kursovaya.utils;

public class DateUtils implements Utils {
    public Integer compareTime(String firstTime, String secondTime) {
        if (secondTime == null) {
            return -2;
        }
        if (firstTime == null) {
            return 2;
        }

        if (firstTime == secondTime) {
            return 0;
        }

        Integer firstTimeHours = Integer.parseInt(firstTime.split(":")[0]);
        Integer firstTimeMinutes = Integer.parseInt(firstTime.split(":")[1]);
        Integer secondTimeHours = Integer.parseInt(secondTime.split(":")[0]);
        Integer secondTimeMinutes = Integer.parseInt(secondTime.split(":")[1]);
        
        if (firstTimeHours < secondTimeHours && firstTimeMinutes == secondTimeMinutes) {
            return 1;
        }

        if (firstTimeHours > secondTimeHours && firstTimeMinutes == secondTimeMinutes) {
            return -1;
        }

        if (secondTimeHours == firstTimeHours) {
            if (firstTimeMinutes < secondTimeMinutes) {
                return 1;
            }
            if (firstTimeMinutes < secondTimeMinutes) {
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

    @Override
    public void printUtilsInformation() {
        System.out.println("Класс Utils для дат.");
    }
}
