// ===============================
// MENU MOVIL
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

// ===============================
// SMOOTH SCROLL
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (navMenu) {
            navMenu.classList.remove("active");
        }
    });
});

// ===============================
// FAQ DESPLEGABLE
// ===============================

document.querySelectorAll(".faq button").forEach(button => {
    button.addEventListener("click", () => {
        const answer = button.nextElementSibling;
        const isOpen = answer.style.display === "block";

        document.querySelectorAll(".faq p").forEach(item => {
            item.style.display = "none";
        });

        answer.style.display = isOpen ? "none" : "block";
    });
});

// ===============================
// VALIDACION DEL FORMULARIO
// ===============================

const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || email === "") {
            alert("Por favor complete los campos Nombre y Correo.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Ingrese un correo electronico valido.");
            return;
        }

        const subject = encodeURIComponent("Solicitud de cotizacion - Carpinteria Calero");
        const body = encodeURIComponent(
            `Nombre: ${name}\n` +
            `Correo: ${email}\n` +
            `Telefono: ${phone || "No indicado"}\n\n` +
            `Mensaje:\n${message || "No indicado"}`
        );

        window.location.href = `mailto:carpinteriacalero26@gmail.com?subject=${subject}&body=${body}`;

        alert("Se abrira tu correo para enviar la solicitud a Carpinteria Calero.");
        form.reset();
    });
}

// ===============================
// PRODUCTOS, MODAL Y CARRITO
// ===============================

const products = document.querySelectorAll(".product-card");
const cart = [];

const productPrices = {
    escritorio1: "C$ 6,500",
    escritorio2: "C$ 5,200",
    escritorio3: "C$ 2,800",
    ventana1: "C$ 2,400",
    ventana2: "C$ 2,100",
    ventana3: "C$ 3,200",
    puerta1: "C$ 3,800",
    puerta2: "C$ 4,500",
    puerta3: "C$ 8,500",
    alacena1: "C$ 4,200",
    alacena2: "C$ 14,500",
    alacena3: "C$ 22,000",
    cama1: "C$ 5,500",
    cama2: "C$ 4,200",
    cama3: "C$ 7,200",
    esquinero1: "C$ 3,800",
    esquinero2: "C$ 3,200",
    esquinero3: "C$ 1,500",
    repisa1: "C$ 1,800",
    repisa2: "C$ 3,500",
    mesa_noche1: "C$ 2,600",
    mesa_noche2: "C$ 2,200",
    silla_mesedora1: "C$ 5,500",
    silla_mesedora2: "C$ 4,800",
    silla_mesedora3: "C$ 4,200",
    banco1: "C$ 950",
    banco2: "C$ 1,400",
    banco3: "C$ 1,800",
    banco4: "C$ 1,200",
    mesa1: "C$ 9,500",
    mesa2: "C$ 3,500",
    mesa3: "C$ 7,800",
    silla1: "C$ 1,500",
    silla2: "C$ 2,200",
    silla3: "C$ 1,650",
    silla4: "C$ 1,900",
    ropero1: "C$ 12,500",
    ropero2: "C$ 11,500",
    ropero3: "C$ 9,800"
};

function getProductCategory(product) {
    const categoryPrices = {
        oficina: "Precio a consultar",
        ventanas: "Precio a consultar",
        puertas: "Precio a consultar",
        cocina: "Precio a consultar",
        dormitorio: "Precio a consultar"
    };

    return Object.keys(categoryPrices).find(category => product.classList.contains(category));
}

function getProductKey(image) {
    return image.split("/").pop().replace(/\.[^.]+$/, "");
}

function getProductInfo(product) {
    const title = product.querySelector("h3")?.textContent.trim() || "Producto";
    const description = product.querySelector("p")?.textContent.trim() || "Producto elaborado a medida con acabados profesionales.";
    const image = product.querySelector("img")?.getAttribute("src") || "";
    const category = getProductCategory(product);
    const productKey = getProductKey(image);
    const price = product.dataset.price || productPrices[productKey] || "Precio a consultar";

    return { title, description, image, price, category };
}

products.forEach((product, index) => {
    product.dataset.productId = String(index);

    const button = product.querySelector(".product-btn");

    if (button) {
        button.textContent = "Ver producto";
        button.setAttribute("type", "button");
        button.addEventListener("click", () => openProductModal(getProductInfo(product)));
    }
});

const modalBackdrop = document.createElement("div");
modalBackdrop.className = "modal-backdrop";
modalBackdrop.innerHTML = `
    <div class="product-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <img class="modal-image" alt="">
        <div class="modal-content">
            <button class="modal-close" type="button" aria-label="Cerrar">x</button>
            <h3 id="modalTitle"></h3>
            <p class="modal-description"></p>
            <strong class="modal-price"></strong>
            <button class="btn modal-cart-btn" type="button">Agregar al carrito</button>
        </div>
    </div>
`;

document.body.appendChild(modalBackdrop);

const modalImage = modalBackdrop.querySelector(".modal-image");
const modalTitle = modalBackdrop.querySelector("#modalTitle");
const modalDescription = modalBackdrop.querySelector(".modal-description");
const modalPrice = modalBackdrop.querySelector(".modal-price");
const modalCartButton = modalBackdrop.querySelector(".modal-cart-btn");
let activeProduct = null;

function openProductModal(product) {
    activeProduct = product;
    modalImage.src = product.image;
    modalImage.alt = product.title;
    modalTitle.textContent = product.title;
    modalDescription.textContent = product.description;
    modalPrice.textContent = product.price;
    modalBackdrop.classList.add("active");
}

function closeProductModal() {
    modalBackdrop.classList.remove("active");
}

modalBackdrop.querySelector(".modal-close").addEventListener("click", closeProductModal);
modalBackdrop.addEventListener("click", event => {
    if (event.target === modalBackdrop) {
        closeProductModal();
    }
});

modalCartButton.addEventListener("click", () => {
    if (!activeProduct) {
        return;
    }

    cart.push(activeProduct);
    updateCart();
    closeProductModal();
    openCartPanel();
});

const cartToggle = document.createElement("button");
cartToggle.className = "cart-toggle";
cartToggle.type = "button";
cartToggle.setAttribute("aria-label", "Abrir carrito");
cartToggle.innerHTML = `Carrito <span class="cart-count">0</span>`;
document.body.appendChild(cartToggle);

const cartBackdrop = document.createElement("div");
cartBackdrop.className = "cart-panel-backdrop";
cartBackdrop.innerHTML = `
    <aside class="cart-panel" aria-label="Carrito de compra">
        <button class="cart-close" type="button" aria-label="Cerrar">x</button>
        <h3>Carrito de compra</h3>
        <div class="cart-list"></div>
        <p class="cart-empty">Todavia no has agregado productos.</p>
        <a class="btn cart-checkout" href="#contacto">Solicitar compra</a>
    </aside>
`;
document.body.appendChild(cartBackdrop);

const cartCount = cartToggle.querySelector(".cart-count");
const cartList = cartBackdrop.querySelector(".cart-list");
const cartEmpty = cartBackdrop.querySelector(".cart-empty");

function updateCart() {
    cartCount.textContent = String(cart.length);
    cartList.innerHTML = "";
    cartEmpty.style.display = cart.length ? "none" : "block";

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="">
            <div>
                <h4>${item.title}</h4>
                <p>${item.price}</p>
            </div>
            <button class="cart-remove" type="button" aria-label="Quitar producto">x</button>
        `;

        cartItem.querySelector(".cart-remove").addEventListener("click", () => {
            cart.splice(index, 1);
            updateCart();
        });

        cartList.appendChild(cartItem);
    });
}

function openCartPanel() {
    cartBackdrop.classList.add("active");
}

function closeCartPanel() {
    cartBackdrop.classList.remove("active");
}

cartToggle.addEventListener("click", openCartPanel);
cartBackdrop.querySelector(".cart-close").addEventListener("click", closeCartPanel);
cartBackdrop.addEventListener("click", event => {
    if (event.target === cartBackdrop) {
        closeCartPanel();
    }
});

cartBackdrop.querySelector(".cart-checkout").addEventListener("click", () => {
    closeCartPanel();

    const message = document.getElementById("message");
    if (message && cart.length) {
        const productList = cart.map(item => `- ${item.title} (${item.price})`).join("\n");
        message.value = `Hola, quiero consultar estos productos:\n${productList}`;
    }
});

// ===============================
// FILTROS DEL CATALOGO
// ===============================

document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        filter.classList.add("active");

        const category = filter.getAttribute("data-filter");

        products.forEach(product => {
            product.style.display =
                category === "all" || product.classList.contains(category)
                    ? "flex"
                    : "none";
        });
    });
});

// ===============================
// ANIMACION AL HACER SCROLL
// ===============================

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    {
        threshold: 0.2
    }
);

document.querySelectorAll(".card, .product-card, .testimonial").forEach(element => {
    element.classList.add("hidden");
    observer.observe(element);
});
