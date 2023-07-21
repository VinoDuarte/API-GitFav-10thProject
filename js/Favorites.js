import { GithubUser } from "./GithubUser.js"

//dados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  delete(user) {
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }


  async add(username) { 
   try {

    const userExists = this.entries.find(entry => entry.login === username)
    if(userExists) {
      throw new Error('Usuário já cadastrado')
    }


    const user = await GithubUser.search(username)

    if(user.login ===undefined) {
      throw new Error('Usuário não encontrado!')
    }

    this.entries = [user, ...this.entries]
    this.update()
    this.save

  } catch(error) {
    alert(error.message)
  }

  }
  
}


//visualização
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()
  }

  onadd() {
   const addButton = this.root.querySelector('.setUser button')

   addButton.onclick = () => {
    const { value } = this.root.querySelector('input')

    this.add(value) 
   }
  }

  update() {
   this.RemoveAllTr()
   
   
  
  this.entries.forEach( user => {
    const row = this.createRow()

    row.querySelector('.maior img').src = `https://github.com/${user.login}.png`
    row.querySelector('.maior p').textContent = user.name
    row.querySelector('.maior a').href = `https://github.com/${user.login}`
    row.querySelector('.maior img').alt = `Imagem de ${user.name}`
    row.querySelector('.maior span').textContent = `/${user.login}`
    row.querySelector('.repositories').textContent = user.public_repos
    row.querySelector('.followers').textContent = user.followers


    row.querySelector('.remove').onclick = () => {
      const isOk = confirm('Tem certeza que deseja deletar essa linha?')
      if(isOk) {
        this.delete(user)
      }
    
    }
    
    
    this.tbody.append(row)
  })
   
  }

  RemoveAllTr() {
  this.tbody.querySelectorAll('tr').forEach((tr) => {
    tr.remove()
  })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
     <div class="maior">
      <img src="images/Mayk Picture.svg" alt="">
      <a target="_blank">
      <p>Mayk Brito</p>
      <span>/maykbrito</span>
     </a>
   </div>
    </td>
    <td class="repositories">123</td>
    <td class="followers">1234</td>
    <td class="remove"><button>Remover</button></td>
    `
    return tr

  }

}