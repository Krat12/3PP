package boot.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import boot.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> getUsers();

    void addUser(User user);

    User getUserId(long id);

    void deleteById(long id);

    void updateUser(User user);

    User findByEmail(String email);
}
