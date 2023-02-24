package boot.service;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import boot.dao.UserDao;
import boot.model.User;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserDao userDAO;

    public UserServiceImpl(UserDao userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public List<User> getUsers() {
        return userDAO.getAll();
    }

    @Override
    public void addUser(User user) {
        userDAO.create(user);
    }

    @Override
    public User getUserId(long id) {
        return userDAO.read(id);
    }

    @Override
    public void deleteById(long id) {
        userDAO.delete(id);
    }

    @Override
    public void updateUser(User user) {
        userDAO.update(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDAO.getByUserEmail(email);
        if (user == null) throw new UsernameNotFoundException(String.format("User '%s' не найден", email));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), user.getAuthorities());
    }

    @Override
    public User findByEmail(String email) {
        return userDAO.getByUserEmail(email);
    }
}
