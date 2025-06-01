const fs = require('fs');

class UserManager{

    constructor (){
        this.path = './Users.json';
        this.init();
    }

    //init nos va a servir para inicializar las cosas
    async init(){
        if(fs.existsSync(this.path)){
            //Sí, si existe. Entonces no hay que crear nada
        }
        else{
            //Hay que crear el archivo
            await fs.promises.writeFile(this.path,JSON.stringify([]));
        }
    }

    createUser = async ({firstName, lastName, age, course}) => {
        try {
            const newUser = {
                firstName,
                lastName,
                age,
                course
            }

            //Como saber donde insertar el usuario
            const fileData = await fs.promises.readFile(this.path, 'utf-8');
            const users = JSON.parse(fileData); //convierte un String a un arreglo u objeto real

            if(users.length===0){ //El usuario que estoy por insertar es el primer usuario
                newUser.id = 1;
            }
            else{
                newUser.id = users[users.length-1].id+1;
            }

            users.push(newUser);

            await fs.promises.writeFile(this.path,JSON.stringify(users,null,'\t'));

            return newUser.id;
        } catch (error) {
            console.log("Error al ingresar usuario");
            return null;
        }
    }
}

const context = async()=>{
    const userManager = new UserManager();

    const user = {
        firstName: 'Flor',
        lastName: 'Chicahuala',
        age: '31',
        course: 'Backend'
    }
    await userManager.createUser(user);
}

context();