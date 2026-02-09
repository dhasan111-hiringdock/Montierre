const header = document.querySelector(".header");
const sections = document.querySelectorAll(".section");
const bottle = document.querySelector(".hero-bottle");
const heroBottleBody = document.querySelector(".hero-bottle-body");
const cards = document.querySelectorAll(".collection-card");
const fragrances = document.querySelectorAll(".fragrance");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const backgroundTexture = document.querySelector(".background-texture");
const heroLight = document.querySelector(".hero-light");
const chapterLinks = document.querySelectorAll(".chapter-link");
const galleries = document.querySelectorAll(".fragrance-gallery");
const heroOrbit = document.querySelector(".hero-orbit");
const heroCollectionDots = document.querySelectorAll(".hero-collection-dot");
const heroPanels = document.querySelectorAll(".hero-panel");
const cartToggle = document.querySelector(".cart-toggle");
const cartCount = document.querySelector("[data-cart-count]");
const cartOverlay = document.querySelector(".cart-overlay");
const cartShell = document.querySelector("[data-cart-shell]");
const cartItems = document.querySelector("[data-cart-items]");
const cartItemsCheckout = document.querySelector("[data-cart-items-checkout]");
const cartSubtotal = document.querySelector("[data-cart-subtotal]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCheckoutButton = document.querySelector("[data-cart-checkout]");
const cartPlaceOrderButton = document.querySelector("[data-cart-place-order]");
const cartBackToBagButton = document.querySelector("[data-cart-back-to-bag]");
const cartCloseAllButton = document.querySelector("[data-cart-close-all]");
const cartBodies = document.querySelectorAll(".cart-body");
const cartCloseTargets = document.querySelectorAll("[data-cart-close]");
const buyNowLinks = document.querySelectorAll("[data-buy-now]");
const checkoutSection = document.getElementById("checkout");
const checkoutItems = document.querySelector("[data-checkout-items]");
const checkoutTotal = document.querySelector("[data-checkout-total]");
const checkoutSubtotalAmount = document.querySelector("[data-checkout-subtotal]");
const checkoutShippingAmount = document.querySelector("[data-checkout-shipping]");
const checkoutDiscountAmount = document.querySelector("[data-checkout-discount]");
const checkoutDiscountRow = document.querySelector("[data-checkout-discount-row]");
const checkoutCouponInput = document.querySelector("[data-checkout-coupon-input]");
const checkoutCouponApply = document.querySelector("[data-checkout-coupon-apply]");
const checkoutCouponMessage = document.querySelector("[data-checkout-coupon-message]");
const checkoutForm = document.querySelector("[data-checkout-form]");
const checkoutThankyou = document.querySelector("[data-checkout-thankyou]");
const checkoutReturn = document.querySelector("[data-checkout-return]");
const checkoutReview = document.querySelector("[data-checkout-review]");
const checkoutReviewBack = document.querySelector("[data-checkout-review-back]");
const checkoutReviewContinue = document.querySelector("[data-checkout-review-continue]");
const checkoutSummary = document.querySelector(".checkout-summary");
const storeRoot = document.querySelector("[data-store-root]");
const CART_STORAGE_KEY = "montierre-cart";
const SHIPPING_FEE = 100;
const COUPON_CODE = "MONTIERRE10";
const COUPON_PERCENT = 10;
let appliedCouponCode = "";
let fragranceLightbox;
let fragranceLightboxImage;
let fragranceLightboxThumbs;
let cartItemsState = [];
const storeProductCopy = {};
const storeProductImages = {};

function revealOnScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
      const id = entry.target.id;
      if (id) {
        chapterLinks.forEach(link => {
          if (link.dataset.target === id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    }
  });
}

const observer = new IntersectionObserver(revealOnScroll, {
  threshold: 0.14,
});

observer.observe(header);
sections.forEach(section => observer.observe(section));
cards.forEach(card => observer.observe(card));
fragrances.forEach(item => observer.observe(item));
if (bottle) observer.observe(bottle);

chapterLinks.forEach(link => {
  link.addEventListener("click", () => {
    const targetId = link.dataset.target;
    const target = document.getElementById(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

function closeFragranceLightbox() {
  if (!fragranceLightbox) return;
  fragranceLightbox.classList.remove("is-open");
  document.body.classList.remove("lightbox-open");
}

function ensureFragranceLightbox() {
  if (fragranceLightbox) return;
  const backdrop = document.createElement("div");
  backdrop.className = "fragrance-lightbox-backdrop";
  const shell = document.createElement("div");
  shell.className = "fragrance-lightbox";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "fragrance-lightbox-close";
  close.setAttribute("aria-label", "Close fragrance view");
  close.textContent = "Close";
  const image = document.createElement("img");
  image.className = "fragrance-lightbox-image";
  image.alt = "Montierre fragrance image";
  const thumbs = document.createElement("div");
  thumbs.className = "fragrance-lightbox-thumbs";
  shell.appendChild(close);
  shell.appendChild(image);
  shell.appendChild(thumbs);
  backdrop.appendChild(shell);
  document.body.appendChild(backdrop);
  fragranceLightbox = backdrop;
  fragranceLightboxImage = image;
  fragranceLightboxThumbs = thumbs;
  close.addEventListener("click", () => {
    closeFragranceLightbox();
  });
  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) {
      closeFragranceLightbox();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeFragranceLightbox();
    }
  });
}

function openFragranceLightbox(images, startIndex) {
  const usableImages = images.filter(Boolean);
  if (!usableImages.length) return;
  ensureFragranceLightbox();
  fragranceLightboxThumbs.innerHTML = "";
  let currentIndex = Math.min(Math.max(startIndex || 0, 0), usableImages.length - 1);
  usableImages.forEach(src => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "fragrance-lightbox-thumb";
    thumb.style.backgroundImage = `url("${src}")`;
    fragranceLightboxThumbs.appendChild(thumb);
  });
  function setIndex(index) {
    const nextIndex = ((index % usableImages.length) + usableImages.length) % usableImages.length;
    const src = usableImages[nextIndex];
    fragranceLightboxImage.classList.add("is-transitioning");
    const img = new Image();
    img.src = src;
    img.onload = () => {
      fragranceLightboxImage.src = src;
      fragranceLightboxImage.classList.remove("is-transitioning");
    };
    const thumbNodes = Array.from(fragranceLightboxThumbs.children);
    thumbNodes.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === nextIndex);
    });
    currentIndex = nextIndex;
  }
  const thumbNodes = Array.from(fragranceLightboxThumbs.children);
  thumbNodes.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      setIndex(index);
    });
  });
  setIndex(currentIndex);
  fragranceLightbox.classList.add("is-open");
  document.body.classList.add("lightbox-open");
}

galleries.forEach(gallery => {
  const main = gallery.querySelector(".fragrance-main");
  const thumbs = Array.from(gallery.querySelectorAll(".fragrance-thumb"));
  if (!main || !thumbs.length) return;
  const images = thumbs.map(thumb => thumb.dataset.image).filter(Boolean);
  const productId = gallery.dataset.gallery;
  if (productId) {
    storeProductImages[productId] = {
      hero: main.src || images[0],
      images: images.length ? images : main.src ? [main.src] : []
    };
  }
  if (!images.length) return;
  const visual = gallery.closest(".fragrance-visual");
  if (visual && images[0]) {
    if (!visual.querySelector(".fragrance-ambient")) {
      const ambient = document.createElement("div");
      ambient.className = "fragrance-ambient";
      ambient.style.backgroundImage = `url("${images[0]}")`;
      visual.insertBefore(ambient, visual.firstChild);
    }
  }
  let currentIndex = 0;
  let timerId;
  function showImage(index, fromUser) {
    const src = images[index];
    if (!src || !main) return;
    if (index === currentIndex && !fromUser) return;
    main.classList.add("is-transitioning");
    const img = new Image();
    img.src = src;
    img.onload = () => {
      main.src = src;
      main.classList.remove("is-transitioning");
    };
    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === index);
    });
    currentIndex = index;
  }
  function startAuto() {
    if (images.length <= 1) return;
    timerId = window.setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      showImage(nextIndex, false);
    }, 2600);
  }
  thumbs.forEach((thumb, index) => {
    const src = images[index];
    if (src) {
      thumb.style.backgroundImage = `url("${src}")`;
    }
    thumb.addEventListener("click", () => {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = undefined;
      }
      showImage(index, true);
      openFragranceLightbox(images, index);
    });
  });
  gallery.addEventListener("click", event => {
    const target = event.target;
    if (target.closest && target.closest(".fragrance-thumb")) {
      return;
    }
    openFragranceLightbox(images, currentIndex);
  });
  gallery.addEventListener("mouseenter", () => {
    if (!timerId) {
      startAuto();
    }
  });
  gallery.addEventListener("mouseleave", () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = undefined;
    }
  });
  showImage(0, true);
});

menuToggle.addEventListener("click", () => {
  const open = menuToggle.classList.toggle("open");
  if (open) {
    nav.classList.add("open");
  } else {
    nav.classList.remove("open");
  }
});

nav.addEventListener("click", event => {
  if (event.target.tagName === "A") {
    menuToggle.classList.remove("open");
    nav.classList.remove("open");
  }
});

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (backgroundTexture) {
    backgroundTexture.style.transform = `translate3d(${y * -0.02}px, ${y * -0.04}px, 0)`;
  }
   if (heroBottleBody) {
     heroBottleBody.style.transform = `translate3d(0, ${y * -0.03}px, 0)`;
   }
});

window.addEventListener("mousemove", event => {
  if (!heroLight) return;
  const xRatio = event.clientX / window.innerWidth - 0.5;
  const yRatio = event.clientY / window.innerHeight - 0.5;
  const x = xRatio * 10;
  const y = yRatio * 10;
  heroLight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

const heroSection = document.querySelector(".hero");
const heroBackgroundDots = document.querySelectorAll(".hero-background-dot");

if (heroSection && heroBackgroundDots.length) {
  const heroBackgroundImages = [
    "Assets/Website product Images/Hero Section Background/ChatGPT Image Feb 9, 2026, 02_57_13 PM.png",
    "Assets/Website product Images/Hero Section Background/ChatGPT Image Feb 9, 2026, 02_57_27 PM.png",
    "Assets/Website product Images/Hero Section Background/ChatGPT Image Feb 9, 2026, 02_59_26 PM.png"
  ];
  let heroBackgroundIndex = 0;
  let heroBackgroundTimerId;
  function setHeroBackgroundIndex(index, fromUser) {
    const total = heroBackgroundImages.length;
    if (!total) return;
    const nextIndex = ((index % total) + total) % total;
    heroBackgroundDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === nextIndex);
    });
    const image = heroBackgroundImages[nextIndex];
    heroSection.style.backgroundImage =
      `linear-gradient(to bottom, rgba(5, 5, 6, 0.9), rgba(5, 5, 6, 0.85)), url("${image}")`;
    heroBackgroundIndex = nextIndex;
    if (fromUser && heroBackgroundTimerId) {
      window.clearInterval(heroBackgroundTimerId);
      heroBackgroundTimerId = undefined;
    }
  }
  function startHeroBackgroundAuto() {
    if (heroBackgroundTimerId) return;
    heroBackgroundTimerId = window.setInterval(() => {
      setHeroBackgroundIndex(heroBackgroundIndex + 1, false);
    }, 9000);
  }
  heroBackgroundDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setHeroBackgroundIndex(index, true);
      startHeroBackgroundAuto();
    });
  });
  setHeroBackgroundIndex(0, true);
  startHeroBackgroundAuto();
}

if (heroOrbit && heroCollectionDots.length && heroPanels.length) {
  let heroIndex = 0;
  let heroTimerId;
  function setHeroIndex(index, fromUser) {
    const total = heroCollectionDots.length;
    if (!total) return;
    const nextIndex = ((index % total) + total) % total;
    heroCollectionDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === nextIndex);
    });
    heroPanels.forEach((panel, panelIndex) => {
      panel.classList.toggle("is-active", panelIndex === nextIndex);
    });
    heroIndex = nextIndex;
    if (fromUser && heroTimerId) {
      window.clearInterval(heroTimerId);
      heroTimerId = undefined;
    }
  }
  function startHeroAuto() {
    if (heroTimerId) return;
    heroTimerId = window.setInterval(() => {
      setHeroIndex(heroIndex + 1, false);
    }, 9000);
  }
  heroCollectionDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setHeroIndex(index, true);
      startHeroAuto();
    });
  });
  const heroCarousel = document.querySelector(".hero-carousel");
  if (heroCarousel) {
    heroCarousel.addEventListener("mouseenter", () => {
      if (heroTimerId) {
        window.clearInterval(heroTimerId);
        heroTimerId = undefined;
      }
    });
    heroCarousel.addEventListener("mouseleave", () => {
      startHeroAuto();
    });
  }
  setHeroIndex(0, true);
  startHeroAuto();
}

const productCatalog = {
  "cedar-flame": { name: "Cedar Flame", collection: "Privé", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "cedar-storm": { name: "Cedar Storm", collection: "Haute", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "crimson-saffron": { name: "Crimson Saffron", collection: "Privé", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "pear-bloom": { name: "Pear Bloom", collection: "Haute", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "oud-mirage": { name: "Oud Mirage", collection: "Privé", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "midnight-orchid": { name: "Midnight Orchid", collection: "Signature", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "ocean-musk": { name: "Ocean Musk", collection: "Signature", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "pine-noir": { name: "Pine Noir", collection: "Privé", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "citrus-drift": { name: "Citrus Drift", collection: "Haute", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "sugar-veil": { name: "Sugar Veil", collection: "Signature", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] },
  "spiced-brew": { name: "Spiced Brew", collection: "Signature", sizes: [{ id: "50", label: "50 ml", price: 1200 }, { id: "100", label: "100 ml", price: 1200 }] }
};

function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function setCartStage(stage) {
  cartBodies.forEach(body => {
    const bodyStage = body.dataset.cartStage;
    body.classList.toggle("is-active", bodyStage === stage);
  });
}

function updateCartCount() {
  if (!cartCount) return;
  const count = cartItemsState.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = String(count);
  if (!cartToggle) return;
  if (count > 0) {
    cartToggle.classList.add("is-visible");
  } else {
    cartToggle.classList.remove("is-visible");
  }
}

function loadCartFromStorage() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    cartItemsState = parsed.filter(item => item && typeof item.productId === "string" && typeof item.quantity === "number" && item.quantity > 0);
  } catch {
  }
}

function saveCartToStorage() {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItemsState));
  } catch {
  }
}

function ensureStoreProductImages() {
  if (Object.keys(storeProductImages).length) return;
  const base = "Assets/Website product Images";
  storeProductImages["cedar-flame"] = {
    hero: `${base}/Cedar Flame/Second Image.jpg`,
    images: [`${base}/Cedar Flame/Second Image.jpg`]
  };
  storeProductImages["cedar-storm"] = {
    hero: `${base}/Cedar Storm/Second Image.jpg`,
    images: [`${base}/Cedar Storm/Second Image.jpg`]
  };
  storeProductImages["crimson-saffron"] = {
    hero: `${base}/Crimson Saffron/Second Image.jpg`,
    images: [`${base}/Crimson Saffron/Second Image.jpg`]
  };
  storeProductImages["pear-bloom"] = {
    hero: `${base}/Pear Bloom/Second Image.jpg`,
    images: [`${base}/Pear Bloom/Second Image.jpg`]
  };
  storeProductImages["oud-mirage"] = {
    hero: `${base}/Oud Mirage/Second Image.jpg`,
    images: [`${base}/Oud Mirage/Second Image.jpg`]
  };
  storeProductImages["midnight-orchid"] = {
    hero: `${base}/Midnight Orchid/Second Image.jpg`,
    images: [`${base}/Midnight Orchid/Second Image.jpg`]
  };
  storeProductImages["ocean-musk"] = {
    hero: `${base}/Ocean Musk/Second Image.jpg`,
    images: [`${base}/Ocean Musk/Second Image.jpg`]
  };
  storeProductImages["pine-noir"] = {
    hero: `${base}/Pine Noir/Second Image.jpg`,
    images: [`${base}/Pine Noir/Second Image.jpg`]
  };
  storeProductImages["citrus-drift"] = {
    hero: `${base}/Citrus Drift/Second Image.jpg`,
    images: [`${base}/Citrus Drift/Second Image.jpg`]
  };
  storeProductImages["sugar-veil"] = {
    hero: `${base}/Sugar Veil/Second Image.jpg`,
    images: [`${base}/Sugar Veil/Second Image.jpg`]
  };
  storeProductImages["spiced-brew"] = {
    hero: `${base}/Spiced Brew/Second Image.jpg`,
    images: [`${base}/Spiced Brew/Second Image.jpg`]
  };
}

function calculateTotals(subtotal) {
  const shipping = cartItemsState.length ? SHIPPING_FEE : 0;
  const discountBase = subtotal;
  let discount = 0;
  if (appliedCouponCode === COUPON_CODE && COUPON_PERCENT > 0) {
    discount = Math.round(discountBase * (COUPON_PERCENT / 100));
  }
  const total = Math.max(0, subtotal + shipping - discount);
  return { subtotal, shipping, discount, total };
}

function getProductSize(productId, sizeId) {
  const product = productCatalog[productId];
  if (!product) return undefined;
  const sizes = product.sizes || [];
  if (!sizes.length) return undefined;
  if (!sizeId) return sizes[0];
  return sizes.find(size => size.id === sizeId) || sizes[0];
}

function getCartItemTotal(item) {
  const size = getProductSize(item.productId, item.sizeId);
  if (!size) return 0;
  return size.price * item.quantity;
}

function renderCart() {
  if (!cartItems || !cartSubtotal || !cartItemsCheckout || !cartTotal) return;
  cartItems.innerHTML = "";
  cartItemsCheckout.innerHTML = "";
  let subtotal = 0;
  if (cartItemsState.length) {
    const bagLabel = document.createElement("div");
    bagLabel.className = "cart-section-label";
    bagLabel.textContent = "In your bag";
    cartItems.appendChild(bagLabel);
    cartItemsState.forEach(item => {
      const product = productCatalog[item.productId];
      if (!product) return;
      const size = getProductSize(item.productId, item.sizeId);
      if (!size) return;
      const lineTotal = getCartItemTotal(item);
      subtotal += lineTotal;
      const container = document.createElement("div");
      container.className = "cart-item";
      container.dataset.productId = item.productId;
      container.dataset.sizeId = size.id;
      const main = document.createElement("div");
      main.className = "cart-item-main";
      const name = document.createElement("div");
      name.className = "cart-item-name";
      name.textContent = product.name;
      const meta = document.createElement("div");
      meta.className = "cart-item-meta";
      meta.textContent = `${product.collection} • ${size.label}`;
      const sizeSelect = document.createElement("select");
      sizeSelect.className = "cart-size-select";
      product.sizes.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option.id;
        opt.textContent = `${option.label} — ${formatPrice(option.price)}`;
        if (option.id === size.id) {
          opt.selected = true;
        }
        sizeSelect.appendChild(opt);
      });
      main.appendChild(name);
      main.appendChild(meta);
      main.appendChild(sizeSelect);
      const controls = document.createElement("div");
      controls.className = "cart-item-controls";
      const price = document.createElement("div");
      price.className = "cart-item-price";
      price.textContent = formatPrice(lineTotal);
      const qty = document.createElement("div");
      qty.className = "cart-qty";
      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.dataset.cartAction = "decrease";
      const count = document.createElement("span");
      count.textContent = String(item.quantity);
      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.dataset.cartAction = "increase";
      qty.appendChild(minus);
      qty.appendChild(count);
      qty.appendChild(plus);
      controls.appendChild(price);
      controls.appendChild(qty);
      container.appendChild(main);
      container.appendChild(controls);
      cartItems.appendChild(container);
      const checkoutRow = container.cloneNode(true);
      cartItemsCheckout.appendChild(checkoutRow);
    });
  } else {
    cartItemsCheckout.innerHTML = "";
  }
  const catalogWrapper = document.createElement("div");
  catalogWrapper.className = "cart-catalog";
  const catalogLabel = document.createElement("div");
  catalogLabel.className = "cart-section-label";
  catalogLabel.textContent = cartItemsState.length ? "Add another fragrance" : "Select a fragrance";
  catalogWrapper.appendChild(catalogLabel);
  const catalogList = document.createElement("div");
  catalogList.className = "cart-catalog-list";
  catalogWrapper.appendChild(catalogList);
  Object.keys(productCatalog).forEach(productId => {
    const product = productCatalog[productId];
    if (!product) return;
    const baseSize = getProductSize(productId);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "cart-catalog-item";
    row.dataset.productId = productId;
    const name = document.createElement("div");
    name.className = "cart-catalog-name";
    name.textContent = product.name;
    const meta = document.createElement("div");
    meta.className = "cart-catalog-meta";
    if (baseSize) {
      meta.textContent = `${product.collection} • ${baseSize.label} — ${formatPrice(baseSize.price)}`;
    } else {
      meta.textContent = product.collection;
    }
    row.appendChild(name);
    row.appendChild(meta);
    catalogList.appendChild(row);
  });
  cartItems.appendChild(catalogWrapper);
  const totals = calculateTotals(subtotal);
  cartSubtotal.textContent = formatPrice(totals.subtotal);
  cartTotal.textContent = formatPrice(totals.total);
  updateCartCount();
  saveCartToStorage();
  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  if (!checkoutItems || !checkoutTotal) return;
  checkoutItems.innerHTML = "";
  if (!cartItemsState.length) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    empty.textContent = "Your order summary will appear here once you add a fragrance.";
    checkoutItems.appendChild(empty);
    if (checkoutSubtotalAmount) checkoutSubtotalAmount.textContent = formatPrice(0);
    if (checkoutShippingAmount) checkoutShippingAmount.textContent = formatPrice(0);
    if (checkoutDiscountAmount) checkoutDiscountAmount.textContent = formatPrice(0);
    if (checkoutDiscountRow) checkoutDiscountRow.style.display = "none";
    checkoutTotal.textContent = formatPrice(0);
    return;
  }
  let subtotal = 0;
  cartItemsState.forEach(item => {
    const product = productCatalog[item.productId];
    if (!product) return;
    const size = getProductSize(item.productId, item.sizeId);
    if (!size) return;
    const lineTotal = getCartItemTotal(item);
    subtotal += lineTotal;
    const row = document.createElement("div");
    row.className = "checkout-item";
    const main = document.createElement("div");
    main.className = "checkout-item-main";
    const name = document.createElement("div");
    name.className = "checkout-item-name";
    name.textContent = product.name;
    const meta = document.createElement("div");
    meta.className = "checkout-item-meta";
    meta.textContent = `${product.collection} • ${size.label} • Qty ${item.quantity}`;
    main.appendChild(name);
    main.appendChild(meta);
    const price = document.createElement("div");
    price.className = "checkout-item-price";
    price.textContent = formatPrice(lineTotal);
    row.appendChild(main);
    row.appendChild(price);
    checkoutItems.appendChild(row);
  });
  const totals = calculateTotals(subtotal);
  if (checkoutSubtotalAmount) checkoutSubtotalAmount.textContent = formatPrice(totals.subtotal);
  if (checkoutShippingAmount) checkoutShippingAmount.textContent = formatPrice(totals.shipping);
  if (checkoutDiscountAmount && checkoutDiscountRow) {
    if (totals.discount > 0) {
      checkoutDiscountAmount.textContent = `−${formatPrice(totals.discount).replace("₹", "")}`;
      checkoutDiscountRow.style.display = "";
    } else {
      checkoutDiscountAmount.textContent = formatPrice(0);
      checkoutDiscountRow.style.display = "none";
    }
  }
  checkoutTotal.textContent = formatPrice(totals.total);
}

function openCart() {
  if (!cartOverlay || !cartShell) return;
  cartOverlay.classList.add("is-open");
  setCartStage("cart");
}

function closeCart() {
  if (!cartOverlay) return;
  cartOverlay.classList.remove("is-open");
}

function addToCart(productId) {
  const product = productCatalog[productId];
  if (!product) return;
  const baseSize = getProductSize(productId);
  const existing = cartItemsState.find(item => item.productId === productId && item.sizeId === baseSize.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItemsState.push({ productId, sizeId: baseSize.id, quantity: 1 });
  }
  renderCart();
  openCart();
}

function initCartInteractions() {
  if (cartToggle) {
    cartToggle.addEventListener("click", () => {
      if (cartOverlay && cartOverlay.classList.contains("is-open")) {
        closeCart();
      } else {
        openCart();
      }
    });
  }
  cartCloseTargets.forEach(button => {
    button.addEventListener("click", () => {
      closeCart();
    });
  });
  if (cartCloseAllButton) {
    cartCloseAllButton.addEventListener("click", () => {
      closeCart();
    });
  }
  if (cartOverlay && cartShell) {
    cartOverlay.addEventListener("click", event => {
      if (event.target === cartOverlay) {
        closeCart();
      }
    });
  }
  if (cartCheckoutButton) {
    cartCheckoutButton.addEventListener("click", () => {
      if (!cartItemsState.length) {
        return;
      }
      renderCart();
      renderCheckoutSummary();
      closeCart();
      if (checkoutSection) {
        window.scrollTo({
          top: checkoutSection.offsetTop - 80,
          behavior: "smooth"
        });
      }
    });
  }
  if (cartBackToBagButton) {
    cartBackToBagButton.addEventListener("click", () => {
      setCartStage("cart");
    });
  }
  if (cartPlaceOrderButton) {
    cartPlaceOrderButton.addEventListener("click", () => {
      setCartStage("confirmation");
    });
  }
  if (cartItems) {
    cartItems.addEventListener("click", event => {
      const button = event.target;
      if (!(button instanceof HTMLElement)) return;
      const action = button.dataset.cartAction;
      if (!action) return;
      const itemNode = button.closest(".cart-item");
      if (!itemNode) return;
      const productId = itemNode.dataset.productId;
      const sizeId = itemNode.dataset.sizeId;
      const item = cartItemsState.find(entry => entry.productId === productId && entry.sizeId === sizeId);
      if (!item) return;
      if (action === "increase") {
        item.quantity += 1;
      } else if (action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          cartItemsState = cartItemsState.filter(entry => !(entry.productId === productId && entry.sizeId === sizeId));
        }
      }
      renderCart();
    });
    cartItems.addEventListener("change", event => {
      const select = event.target;
      if (!(select instanceof HTMLSelectElement)) return;
      if (!select.classList.contains("cart-size-select")) return;
      const itemNode = select.closest(".cart-item");
      if (!itemNode) return;
      const productId = itemNode.dataset.productId;
      const previousSizeId = itemNode.dataset.sizeId;
      const nextSizeId = select.value;
      const item = cartItemsState.find(entry => entry.productId === productId && entry.sizeId === previousSizeId);
      if (!item) return;
      item.sizeId = nextSizeId;
      renderCart();
    });
  }
  if (buyNowLinks.length) {
    buyNowLinks.forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        const targetId = link.getAttribute("href")?.slice(1);
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth"
          });
        }
      });
    });
  }
  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains("purchase-add")) {
      const productId = target.dataset.productId;
      if (!productId) return;
      addToCart(productId);
      return;
    }
    const catalogItem = target.closest(".cart-catalog-item");
    if (catalogItem && catalogItem instanceof HTMLElement) {
      const productId = catalogItem.dataset.productId;
      if (!productId) return;
      addToCart(productId);
    }
  });
}

function completeCheckout() {
  if (!checkoutForm || !checkoutThankyou) return;
  checkoutForm.style.display = "none";
  checkoutThankyou.classList.add("is-visible");
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    timeZoneName: "short"
  });
  const formattedDate = formatter.format(now);
  if (checkoutSummary) {
    checkoutSummary.classList.add("is-confirmed");
    let confirmation = checkoutSummary.querySelector(".checkout-summary-confirmation");
    if (!confirmation) {
      confirmation = document.createElement("div");
      confirmation.className = "checkout-summary-confirmation";
      const heading = document.createElement("h3");
      heading.textContent = "Order details";
      const row = document.createElement("div");
      row.className = "checkout-summary-confirmation-row";
      const label = document.createElement("span");
      label.textContent = "Order confirmation date";
      const value = document.createElement("span");
      value.className = "checkout-summary-confirmation-date";
      row.appendChild(label);
      row.appendChild(value);
      confirmation.appendChild(heading);
      confirmation.appendChild(row);
      checkoutSummary.appendChild(confirmation);
    }
    const dateNode = checkoutSummary.querySelector(".checkout-summary-confirmation-date");
    if (dateNode) {
      dateNode.textContent = formattedDate;
    }
  }
  cartItemsState = [];
  appliedCouponCode = "";
  renderCart();
  renderCheckoutSummary();
}

if (checkoutForm && checkoutThankyou) {
  checkoutForm.addEventListener("submit", event => {
    event.preventDefault();
    if (checkoutReview) {
      checkoutReview.classList.add("is-visible");
    } else {
      completeCheckout();
    }
  });
}

function buildStore() {
  if (!storeRoot) return;
  ensureStoreProductImages();
  const fragranceNodes = document.querySelectorAll(".fragrance");
  fragranceNodes.forEach(node => {
    const gallery = node.querySelector(".fragrance-gallery");
    const text = node.querySelector(".fragrance-text");
    if (!gallery || !text) return;
    const productId = gallery.dataset.gallery;
    if (!productId) return;
    const titleNode = text.querySelector("h3");
    const paragraphNode = text.querySelector("p");
    const title = titleNode ? titleNode.textContent.trim() : "";
    const paragraph = paragraphNode ? paragraphNode.textContent.trim() : "";
    storeProductCopy[productId] = { title, paragraph };
  });
  const collections = {};
  Object.keys(productCatalog).forEach(productId => {
    const product = productCatalog[productId];
    const key = product.collection;
    if (!collections[key]) {
      collections[key] = [];
    }
    collections[key].push(productId);
  });
  Object.keys(collections).forEach(collectionName => {
    const section = document.createElement("section");
    section.className = "store-collection";
    const header = document.createElement("header");
    header.className = "store-collection-header";
    const label = document.createElement("div");
    label.className = "section-label";
    label.textContent = collectionName;
    const heading = document.createElement("h3");
    heading.textContent = collectionName;
    header.appendChild(label);
    header.appendChild(heading);
    section.appendChild(header);
    const grid = document.createElement("div");
    grid.className = "store-grid";
    const ids = collections[collectionName];
    ids.forEach(productId => {
      const product = productCatalog[productId];
      const copy = storeProductCopy[productId] || {};
      const images = storeProductImages[productId] || {};
      const item = document.createElement("article");
      item.className = "store-item";
      const gallery = document.createElement("div");
      gallery.className = "store-gallery";
      const hero = document.createElement("img");
      hero.className = "store-gallery-main";
      hero.alt = copy.title || product.name;
      hero.src = images.hero || "";
      gallery.appendChild(hero);
      const thumbStrip = document.createElement("div");
      thumbStrip.className = "store-gallery-thumbs";
      const thumbSources = images.images && images.images.length ? images.images : [images.hero].filter(Boolean);
      thumbSources.forEach(src => {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "store-gallery-thumb";
        thumb.style.backgroundImage = `url("${src}")`;
        thumbStrip.appendChild(thumb);
      });
      gallery.appendChild(thumbStrip);
      const body = document.createElement("div");
      body.className = "store-item-body";
      const meta = document.createElement("div");
      meta.className = "store-item-meta";
      const collectionLabel = document.createElement("div");
      collectionLabel.className = "store-item-collection";
      collectionLabel.textContent = collectionName;
      const name = document.createElement("h4");
      name.className = "store-item-name";
      name.textContent = copy.title || product.name;
      const paragraph = document.createElement("p");
      paragraph.className = "store-item-copy";
      paragraph.textContent = copy.paragraph || "";
      meta.appendChild(collectionLabel);
      meta.appendChild(name);
      meta.appendChild(paragraph);
      const purchase = document.createElement("div");
      purchase.className = "purchase purchase-store";
      const row = document.createElement("div");
      row.className = "purchase-row";
      const baseSize = getProductSize(productId);
      const sizeLabel = document.createElement("div");
      sizeLabel.className = "purchase-size-label";
      sizeLabel.textContent = baseSize ? `${baseSize.label} Eau de Parfum` : "Eau de Parfum";
      const price = document.createElement("div");
      price.className = "purchase-price";
      price.textContent = baseSize ? formatPrice(baseSize.price) : "";
      row.appendChild(sizeLabel);
      row.appendChild(price);
      const controls = document.createElement("div");
      controls.className = "purchase-controls";
      const availability = document.createElement("div");
      availability.className = "purchase-availability";
      availability.textContent = "Available online only";
      const add = document.createElement("button");
      add.type = "button";
      add.className = "purchase-add";
      add.dataset.productId = productId;
      add.textContent = "Add to Bag";
      controls.appendChild(availability);
      controls.appendChild(add);
      purchase.appendChild(row);
      purchase.appendChild(controls);
      body.appendChild(meta);
      body.appendChild(purchase);
      item.appendChild(gallery);
      item.appendChild(body);
      grid.appendChild(item);
    });
    section.appendChild(grid);
    storeRoot.appendChild(section);
  });
}
if (checkoutReview && checkoutReviewBack && checkoutReviewContinue) {
  checkoutReviewBack.addEventListener("click", () => {
    checkoutReview.classList.remove("is-visible");
  });
  checkoutReviewContinue.addEventListener("click", () => {
    checkoutReview.classList.remove("is-visible");
    completeCheckout();
  });
}

if (checkoutReturn && checkoutSection) {
  checkoutReturn.addEventListener("click", () => {
    if (checkoutForm && checkoutThankyou) {
      checkoutForm.reset();
      checkoutForm.style.display = "";
      checkoutThankyou.classList.remove("is-visible");
    }
    if (checkoutSummary) {
      checkoutSummary.classList.remove("is-confirmed");
      const confirmation = checkoutSummary.querySelector(".checkout-summary-confirmation");
      if (confirmation) {
        confirmation.remove();
      }
    }
    const collections = document.getElementById("collections");
    const target = collections || checkoutSection;
    window.scrollTo({
      top: target.offsetTop - 80,
      behavior: "smooth"
    });
  });
}

renderCheckoutSummary();
loadCartFromStorage();
buildStore();
renderCart();
initCartInteractions();

if (checkoutCouponApply && checkoutCouponInput) {
  checkoutCouponApply.addEventListener("click", () => {
    const rawCode = checkoutCouponInput.value.trim();
    const code = rawCode.toUpperCase();
    if (!code) {
      appliedCouponCode = "";
      if (checkoutCouponMessage) {
        checkoutCouponMessage.textContent = "";
      }
      renderCart();
      return;
    }
    if (code === COUPON_CODE) {
      appliedCouponCode = code;
      if (checkoutCouponMessage) {
        checkoutCouponMessage.textContent = "Discount applied.";
      }
    } else {
      appliedCouponCode = "";
      if (checkoutCouponMessage) {
        checkoutCouponMessage.textContent = "This code could not be applied.";
      }
    }
    renderCart();
  });
}
