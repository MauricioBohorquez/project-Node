// lo primero que hacemos es importar express y lo demas que necesitemos importar 
const express =  require('express');

const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

//mysql
let conexion = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'proyecto-node'
  });
  //Routes
  app.get('/', function(req, res){
    res.send('Bienvenidos a mi API!');
  });
  //Usuarios
  app.get('/Usuarios', function(req, res){
    const sql = "SELECT * FROM perfilusuario";

    conexion.query(sql,(error, results)=>{
      if(error) throw error;
      if(results.length > 0){
        res.json(results);
      }else{
        res.send('no resultados')
      }
    });
  });
  //  	Listar un usuario por id 
  app.get('/Usuarios/:id', function(req, res){
    const {id} = req.params
    const sql = `SELECT * FROM perfilusuario WHERE idUsuario = ${id}`;
    conexion.query(sql,(error, result)=>{
      if(error) throw error;
      if(result.length > 0){
        res.json(result);
      }else{
        res.send('no resultados')
      }
    });
  });

  app.post('/add', function(req, res){
    const sql = 'INSERT INTO perfilusuario SET ?'
  
    const usuarioObj = {
      name: req.body.name,
      age: req.body.age,
      FechaNacimiento: req.body.FechaNacimiento,
      Cedula: req.body.Cedula,
      Sexo: req.body.Sexo,
      CiudadResidencia: req.body.CiudadResidencia,
      NumeroTelefono: req.body.NumeroTelefono,
      Email: req.body.Email,
      clave: req.body.clave
    }
  
    conexion.query(sql, usuarioObj, error => {
      if (error) {
        if (error) throw error;
      } else {
        console.log('Usuario Creado!');
        res.send('Usuario Creado!');
      }
    });
  });
  

  app.put('/update/:id', function(req, res){
    const { id } = req.params;
    const { name, age, FechaNacimiento, Cedula, Sexo, CiudadResidencia, NumeroTelefono, Email, clave } = req.body; 
    const sql = `UPDATE perfilusuario 
                SET name = '${name}', age = '${age}', FechaNacimiento = '${FechaNacimiento}', Cedula = '${Cedula}', Sexo = '${Sexo}', CiudadResidencia = '${CiudadResidencia}', NumeroTelefono = '${NumeroTelefono}', Email = '${Email}', clave = '${clave}' 
                WHERE idUsuario = ${id}`;
    conexion.query(sql, error => {
        if (error) throw error;
        res.send('Usuario Actualizado!');
    });
});

  app.delete('/delete/:id', function(req, res){
    const {id} = req.params;
    const sql = `DELETE FROM perfilusuario WHERE idUsuario = ${id}`
    conexion.query(sql, error => {
      if (error) throw error;
      res.send('Usuario Eliminado');
    });
  });

  //Mascotas
  // Obtener todas las mascotas de un usuario
app.get('/usuarios/:id/mascotas', function(req, res){
  const { id } = req.params;
  const sql = `SELECT * FROM perfilmascota WHERE Usuario_id = ${id}`;
  conexion.query(sql, (error, results) => {
      if(error) throw error;
      if(results.length > 0){
          res.json(results);
      }else{
          res.send('No hay mascotas para este usuario.');
      }
  });
});

// Agregar una mascota a un usuario
app.post('/usuarios/:id/mascotas', function(req, res){
  const { id } = req.params;
  const { Nombre, Edad, Raza, Sexo, Tipo, Color, Alimento } = req.body;
  const sql = 'INSERT INTO perfilmascota (Nombre, Edad, Raza, Sexo, Tipo, Color, Alimento, Usuario_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  conexion.query(sql, [Nombre, Edad, Raza, Sexo, Tipo, Color, Alimento, id], error => {
      if(error) throw error;
      res.send('Mascota agregada.');
  });
});

// Actualizar información de una mascota
app.put('/usuarios/:id/mascotas/:idMascota', function(req, res){
  const { id, idMascota } = req.params;
  const { Nombre, Edad, Raza, Sexo, Tipo, Color, Alimento } = req.body;
  console.log('Received params:', id, idMascota);
  console.log('Received body:', req.body);

  const sql = `UPDATE perfilmascota SET Nombre = ?, Edad = ?, Raza = ?, Sexo = ?, Tipo = ?, Color = ?, Alimento = ? WHERE idMascota = ? AND Usuario_id = ?`;

  conexion.query(sql, [Nombre, Edad, Raza, Sexo, Tipo, Color, Alimento, idMascota, id], error => {
      if(error) throw error;
      res.send('Información de la mascota actualizada.');
  });
});

// Eliminar una mascota
app.delete('/usuarios/:id/mascotas/:idMascota', function(req, res){
  const { id, idMascota } = req.params;
  const sql = `DELETE FROM perfilmascota WHERE idMascota = ? AND Usuario_id = ?`;
  conexion.query(sql, [idMascota, id], error => {
      if(error) throw error;
      res.send('Mascota eliminada.');
  });
});
  //revisar la conexión 
  conexion.connect(error =>{
    if(error) throw error;
    console.log('el servidor de database esta funcionando!');
  })

  app.listen(PORT, ()=> console.log(`Servidor corriendo en el puerto ${PORT}`));