package boot.dao;

import org.springframework.stereotype.Repository;
import boot.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {
    @PersistenceContext
    private EntityManager em;

    @Override
    public User getByUserEmail(String email) {
        return (User) em.createQuery("select u from User u where u.email=:address")
                .setParameter("address", email)
                .getSingleResult();

    }

    /**
     * Метод Create - даешь в агрументы сущность, метод ее добавляет в контекст постоянства
     * и при commit/rollback обновит базу
     */
    @Override
    public void create(User a) {
        em.persist(a);
    }

    /**
     * Метод Read проверяет есть у сущности id , если есть то вернет обьект под этим ключом
     */
    @Override
    public User read(long id) {
        return em.find(User.class, id);
    }

    /**
     * Метод Delete - сначала ищет сущность в БД/PersistentContext,
     * удаляет его(remove) и по окончании транзакции обновляет в базе
     */
    @Override
    public void delete(long id) {
        em.remove(em.find(User.class, id));
    }

    /**
     * Метод Update добавляет сущность в контекст постоянства и
     * при commit/rollback обновит его состояние в базе
     */
    @Override
    public void update(User f) {
        em.merge(f);
    }

    /**
     * Опциональный метод создания таблицы ( если нет )
     */
    @Override
    public void createTable() {
        em.createNativeQuery("Create table  if NOT EXISTS users (id BIGINT PRIMARY KEY AUTO_INCREMENT " +
                "NOT NULL,firstName varchar(256) NOT NULL ,lastName varchar(256) not null,email int not null);");
    }

    /**
     * Опциональный метод удаления таблицы
     */
    @Override
    public void dropTable() {
        em.createNativeQuery("DROP table  if  EXISTS users");
    }

    /**
     * Опциональный метод очистка таблицы
     */
    @Override
    public void cleanTable() {
        em.createQuery("delete from User").executeUpdate();
    }

    /**
     * Получение всех элементов таблицы
     */
    @Override
    public List<User> getAll() {
        System.out.println(User.class.getSimpleName());
        return em.createQuery("Select u from User u").getResultList();
    }
}
