import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";

// Isolando o repositório, pois não é responsabilidade do controller
// faze inserções e pesquisas dentro do banco de dados, e também nos dar
// mais possibilidades para criar funções customizadas

/**
 * Definindo a classe a seguir como um repositório de usuário
 */
@EntityRepository(User)
class UsersRepository extends Repository<User> {

}

export default UsersRepository;
