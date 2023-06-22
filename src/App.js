import { useState } from 'react';
import { db } from './firebaseConnection';
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore'

import './app.css'


function handleAdd(){
  alert('teste')
}

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  async function handleAdd(){
   // await setDoc(doc(db, "posts", "12345"), {
   //   titulo: titulo,
   //   autor: autor,
   // })
   // .then(() =>{
   //  console.log("Dados registrado no banco")
   // })
   // .catch((error)=>{
   //   console.log("gerou um erro " + error)
   // })

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() =>{
      console.log("Cadastrado com suceeso!")
      setAutor('');
      setTitulo('');
    })
    .catch((error) =>{
      console.log("Erro "+ error)
    })


  }


  async function buscarPost(){

    const postRef = doc(db, "posts", "mTRt4mKLuqi5QBpYcA5X")

    await getDoc(postRef)
    .then((snapShot) =>{
      setAutor(snapShot.data().autor)
      setTitulo(snapShot.data().titulo)
    })
    .catch(() =>{
      console.log("Erro ao buscar")
    })
  }

  return (
    <div>
      <h1>React Js + firebase!!</h1>

      <div className='container'>
        <label>Título:</label>
        <textarea 
          placeholder='Digite o titulo' 
          type='text'
          value={titulo}
          onChange={ (e) => setTitulo(e.target.value) }
        >
        </textarea>

        <label>Autor:</label>
        <input 
          placeholder='Autor do post' 
          type='text'
          value={autor}
          onChange={ (e) => setAutor(e.target.value) }
        >
        </input>

        <button onClick={handleAdd}>Cadastrar:</button>
        <button onClick={buscarPost}>Buscar post</button>
      </div>
    </div>
  );
}

export default App;
