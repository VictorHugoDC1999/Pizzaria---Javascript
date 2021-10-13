let cart = []; //carrinho de compras
let modalQt = 1;
let modalKey = 0;

const selector = element => document.querySelector(element); //Atalho para querySelector
const selectorAll = element => document.querySelectorAll(element); //Atalho para querySelectorAll

// Listagem das pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = selector('.models .pizza-item').cloneNode(true); // Clonando o elemento

  // Preencher as informações em pizzaitem
  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector(
    '.pizza-item--price'
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

  pizzaItem.querySelector('.pizza-item a').addEventListener('click', event => {
    event.preventDefault(); // faz com que ao clicar no link ele não carregue a pagina
    let key = event.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;

    selector('.pizzaBig img').src = pizzaJson[key].img;
    selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    selectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
    selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[
      key
    ].price.toFixed(2)}`;
    selector('.pizzaInfo--qt').innerHTML = modalQt;

    // Animação
    selector('.pizzaWindowArea').style.opacity = 0;
    selector('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
      selector('.pizzaWindowArea').style.opacity = 1;
    }, 200);
  });

  // Adicionando na tela
  selector('.pizza-area').append(pizzaItem);
});

//Eventos do Modal
function closeModal() {
  selector('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    selector('.pizzaWindowArea').style.display = 'none';
  }, 500);
}

selectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(
  item => {
    item.addEventListener('click', closeModal);
  }
);

selector('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (modalQt > 1) {
    modalQt--;
    selector('.pizzaInfo--qt').innerHTML = modalQt;
  }
});

selector('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQt++;
  selector('.pizzaInfo--qt').innerHTML = modalQt;
});

selectorAll('.pizzaInfo--size').forEach(size => {
  size.addEventListener('click', event => {
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

selector('.pizzaInfo--addButton').addEventListener('click', () => {
  let sizePizza = parseInt(
    selector('.pizzaInfo--size.selected').getAttribute('data-key')
  );
  let identifier = pizzaJson[modalKey].id + 'and' + sizePizza; // Esse idenficador vai juntar os itens, junta a chave que identifica qual seria a pizza mais a chave que identifica o tamanho
  let keyCart = cart.findIndex(item => item.identifier == identifier); // Procura dentro do cart o item identifier e se achar um item igual ele vai fazer uma condição
  if (keyCart > -1) {
    //Se ele achou ou seja  keyCart for maior do que -1 entao ele acrescenta na quantidade do mesmo item no carrinho
    cart[keyCart].qt += modalQt;
  } else {
    //se ele nao achar a mesma chave keyCart identificadora, então ele adiciona um novo item, lembrando que ele so retorna -1 se o item não existir
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      sizePizza,
      qt: modalQt
    });
  }

  updateCart();
  closeModal();
});

selector('.menu-openner').addEventListener('click', () => {
  //abrir o cart no mobile
  if (cart.length > 0) {
    selector('aside').style.left = '0';
  }
});
selector('.menu-closer').addEventListener('click', () => {
  //fechar o cart no mobile
  selector('aside').style.left = '100vw';
});

function updateCart() {
  selector('.menu-openner span').innerHTML = cart.length;

  if (cart.length > 0) {
    selector('aside').classList.add('show');
    selector('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;
      let cartItem = selector('.models .cart--item').cloneNode(true); // Clonando o elemento

      let pizzaSizeName;
      switch (cart[i].sizePizza) {
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; //concatenando o nome da pizza com o seu tamanho

      //Preenchendo o cart
      cartItem.querySelector('.cart--item img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', () => {
          if (cart[i].qt > 1) {
            //so diminui a quantidade se for maior que 1
            cart[i].qt--;
          } else {
            //caso a quantidade seja 1 e clique no menos ele retira o item do carrinho
            cart.splice(i, 1);
          }
          updateCart(); //caso tenha so 1 item e formos tirar o item ele fecha o carrinho, o updateCart se responsabiliza por isso
        });
      cartItem
        .querySelector('.cart--item-qtmais')
        .addEventListener('click', () => {
          cart[i].qt++;
          updateCart();
        });

      selector('.cart').append(cartItem);
    }
    desconto = subtotal * 0.1;
    total = subtotal - desconto;
    selector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(
      2
    )}`;
    selector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(
      2
    )}`;
    selector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    selector('aside').classList.remove('show');
    selector('aside').style.left = '100vw'; //ao remover todos os itens do carrinho que não ficar nenhum item, ele vai fechar o cart
  }
}
