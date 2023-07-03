import { useState, useEffect } from 'react';
import { auth, db } from './firebaseConnection';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import './app.css'


function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({})

  const [posts, setPosts] = useState([]);

  useEffect(() => {
     async function loadPosts(){
      const unsub = onSnapshot(collection(db, 'posts'), (snapShot) => { 
        let listaPost = [];

      snapShot.forEach((doc) =>{
      listaPost.push({
        id: doc.id,
        titulo: doc.data().titulo,
        autor: doc.data().autor,
      })
    })

    setPosts(listaPost);
      })
     }

     loadPosts();
  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) =>{
        if(user){
          // se tem usuario logado ele entra aqui...
          console.log(user)
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          // não possui nenhum user logado
          setUser(false)
          setUserDetail({})
        }
      })

    }

    checkLogin();

  }, [])

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

  //  const postRef = doc(db, "posts", "mTRt4mKLuqi5QBpYcA5X")
  //  await getDoc(postRef)
  //  .then((snapShot) =>{
  //    setAutor(snapShot.data().autor)
  //  setTitulo(snapShot.data().titulo)
  //  })
  //  .catch(() =>{
  //    console.log("Erro ao buscar")
   // })

   const postRef = collection(db, "posts")
   await getDocs(postRef)
   .then((snapShot) => {
    let lista = [];

    snapShot.forEach((doc) =>{
      lista.push({
        id: doc.id,
        titulo: doc.data().titulo,
        autor: doc.data().autor,
      })
    })

    setPosts(lista);

   })
   .catch((error) =>{
    console.log("Erro ao buscar")
   })
  }

  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
    .then(() =>{
      console.log('Post atualizado')
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch(() => {
      console.log('Erro ao atualizar post')
    })
  }

  async function excluirPost(id){
    const docRef = doc(db, 'posts', id)
    await deleteDoc(docRef)
    .then(() =>{
      alert('Post deletado com sucesso')
    })
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() =>{
      console.log('Cadastrado com sucesso!')
      setEmail('')
      setSenha('')
    })
    .catch((error) =>{
      if(error.code === 'auth/weak-password'){
        alert('Senha muito fraca!')
      }else if(error.code === 'auth/email-already-in-user'){
        alert("Email já existente")
      }
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) =>{
      console.log('User logado com sucesso')
      console.log(value.user)

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email
      })
      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch(() =>{
      console.log('Erro ao fazer o login!')
    })
  }

  async function fazerLogout(){
    await signOut(auth)
    setUser(false);
    setUserDetail({})
  }

  return (
    <div>
      <h1>React Js + firebase!!</h1>

    {
      user && (
        <div>
          <strong>Seja bem vindo(a) (Você etá logado(a))</strong><br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span><br/><br/>
          <button onClick={fazerLogout}>Sair da conta</button>
          <br/><br/>
        </div>
        
      )
    }
      <div className='container'>
        <h2> Usuarios</h2>
        <label>Email:</label>
        <input
          value={email}
          onChange={ (e) => setEmail(e.target.value) }
          placeholder='Digite um email'
        /><br/>
        <label>Senha:</label>
        <input
          value={senha}
          onChange={ (e) => setSenha(e.target.value) }
          placeholder='Digite sua senha'
        /><br/>

        <button onClick={novoUsuario}>Cadastrar</button><br/>
        <button onClick={logarUsuario}>Login</button>
      </div>
      <br/><br/>
    <hr/>
      <br/><br/>





      <div className='container'>
        <h2>Posts</h2>
        <label>ID do post:</label>
        <input
          placeholder='Digite o Id do post'
          value={idPost}
          onChange={ (e) => setIdPost(e.target.value) }
        >        
        </input><br/>

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
        <button onClick={buscarPost}>Buscar post</button><br/>

        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {posts.map( (post) =>{
            return(
              <li key={post.id}>
                <strong>ID: {post.id} </strong><br/>
                <span>Titulo: {post.titulo} </span><br/>
                <span>Autor: {post.autor}</span><br/>
                <button onClick={ () => excluirPost(post.id) }>Excluir</button><br/><br/>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
