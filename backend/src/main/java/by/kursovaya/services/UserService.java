package by.kursovaya.services;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import by.kursovaya.models.User;
import by.kursovaya.repositories.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void add(User user) {
        userRepository.save(user);
    }

    @Transactional
    public void update(User user) {
        userRepository.save(user);
    }

    @Transactional
    public Optional<User> findByUsername(String username) {
        return userRepository.findAll().stream().filter(u -> u.getUsername().equals(username)).findFirst();
    }

    @Transactional
    public User findById(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
	public Boolean existsByUsername(String username) {
        if (userRepository.findAll().stream().filter(u -> u.getUsername().equals(username)).findFirst().orElse(null) != null) {
            return true;
        }
        else {
            return false;
        }
    }

    @Transactional
    public void deleteUser(User user) {
        userRepository.delete(user);
    }
}
