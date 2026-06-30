import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useFuzzyEffects() {
  const location = useLocation();

  useEffect(() => {
    // 1. Iconsax
    if (typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }

    // 2. Like buttons click handler (event delegation)
    const handleLikeClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const likeBtn = target.closest('.like-btn');
      if (likeBtn) {
        const parent = likeBtn.parentNode as HTMLElement;
        if (parent) {
          parent.classList.toggle('animate');
          parent.classList.toggle('active');
          parent.classList.toggle('inactive');
        }
      }
    };
    document.addEventListener('click', handleLikeClick);

    // 3. Ratio bg-img handling
    const bgImgs = document.querySelectorAll('.bg-img');
    bgImgs.forEach((bgImgEl: any) => {
      const parent = bgImgEl.parentNode;
      if (!parent) return;
      if (bgImgEl.classList.contains('bg-top')) parent.classList.add('b-top');
      else if (bgImgEl.classList.contains('bg-bottom')) parent.classList.add('b-bottom');
      else if (bgImgEl.classList.contains('bg-center')) parent.classList.add('b-center');
      else if (bgImgEl.classList.contains('bg-left')) parent.classList.add('b-left');
      else if (bgImgEl.classList.contains('bg-right')) parent.classList.add('b-right');
      if (bgImgEl.classList.contains('blur-up')) parent.classList.add('blur-up', 'lazyload');
      if (bgImgEl.classList.contains('bg_size_content')) parent.classList.add('b_size_content');
      parent.classList.add('bg-size');
      parent.style.backgroundImage = `url(${bgImgEl.src})`;
      parent.style.backgroundSize = 'cover';
      parent.style.backgroundPosition = 'center';
      parent.style.backgroundRepeat = 'no-repeat';
      parent.style.display = 'block';
      bgImgEl.style.display = 'none';
    });

    // 4. Plus minus quantity items click handler (event delegation)
    const handlePlusMinusClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const addButton = target.closest('.plus-minus-button.add') || target.closest('.plus-minus .add');
      const subButton = target.closest('.plus-minus-button.sub') || target.closest('.plus-minus .sub');
      
      if (addButton) {
        const box = addButton.closest('.plus-minus') || addButton.parentNode;
        const inputEl = box?.querySelector('input[type="number"]') as HTMLInputElement;
        if (inputEl && Number(inputEl.value) < 10) {
          inputEl.value = String(Number(inputEl.value) + 1);
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      if (subButton) {
        const box = subButton.closest('.plus-minus') || subButton.parentNode;
        const inputEl = box?.querySelector('input[type="number"]') as HTMLInputElement;
        if (inputEl && Number(inputEl.value) >= 1) {
          inputEl.value = String(Number(inputEl.value) - 1);
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    };
    document.addEventListener('click', handlePlusMinusClick);

    // 5. Trash delete click handler (event delegation)
    const handleTrashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trashBtn = target.closest('.cart-product-box .trash') || target.closest('.trash');
      if (trashBtn) {
        const box = trashBtn.closest('.cart-product-box') as HTMLElement;
        if (box) {
          box.style.display = 'none';
        }
      }
    };
    document.addEventListener('click', handleTrashClick);

    // 6. Swipers
    if (typeof (window as any).Swiper === 'function') {
      const Swiper = (window as any).Swiper;
      if (document.querySelector(".categories")) {
        new Swiper(".categories", {
          slidesPerView: 4,
          spaceBetween: 10,
          loop: true,
          breakpoints: {
            0: { slidesPerView: 3 },
            375: { slidesPerView: 4 },
            767: { slidesPerView: 5 },
          },
        });
      }
      if (document.querySelector(".offer")) {
        new Swiper(".offer", {
          slidesPerView: 1.5,
          spaceBetween: 20,
          loop: true,
          breakpoints: {
            0: { slidesPerView: 1 },
            375: { slidesPerView: 1.2 },
            425: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
          },
        });
      }
      if (document.querySelector(".similer-product")) {
        new Swiper(".similer-product", {
          slidesPerView: 2,
          spaceBetween: 15,
          loop: true,
        });
      }
      if (document.querySelector(".slider-1")) {
        new Swiper(".slider-1", {
          slidesPerView: 1,
          loop: true,
          autoplay: {
            delay: 2000,
            disableOnInteraction: false,
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
        });
      }
      if (document.querySelector(".product-1")) {
        new Swiper(".product-1", {
          slidesPerView: 1.6,
          loop: true,
          pagination: {
            el: ".swiper-pagination",
            type: "progressbar",
          },
        });
      }
      if (document.querySelector(".product-2")) {
        new Swiper(".product-2", {
          slidesPerView: 3,
          spaceBetween: 30,
          centeredSlides: true,
          loop: true,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        });
      }
    }

    // 7. Offcanvas show
    const myOffcanvas = document.getElementById("offcanvas");
    if (myOffcanvas && (window as any).bootstrap) {
      try {
        const bsOffcanvas = new (window as any).bootstrap.Offcanvas(myOffcanvas);
        bsOffcanvas.show();
      } catch (err) {
        console.error("Failed to init offcanvas: ", err);
      }
    }

    // 8. PWA Install Click Handler
    const installapp = document.getElementById("installapp");
    const handleInstall = async () => {
      const deferredPrompt = (window as any).deferredPrompt;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          (window as any).deferredPrompt = null;
        }
      }
    };
    installapp?.addEventListener("click", handleInstall);

    // 9. RTL and Dark Switch binding
    const dirSwitch = document.querySelector("#dir-switch") as HTMLInputElement;
    const htmlDom = document.querySelector("html");
    const rtlLink = document.querySelector("#rtl-link") as HTMLLinkElement;
    
    if (dirSwitch && htmlDom && rtlLink) {
      const currentDir = localStorage.getItem("dir") || "ltr";
      dirSwitch.checked = currentDir === "rtl";
      
      const dirHandler = (e: Event) => {
        const checkbox = e.target as HTMLInputElement;
        if (checkbox.checked) {
          htmlDom.setAttribute("dir", "rtl");
          rtlLink.href = "assets/css/vendors/bootstrap.rtl.min.css";
          localStorage.setItem("rtlcss", "assets/css/vendors/bootstrap.rtl.min.css");
          localStorage.setItem("dir", "rtl");
        } else {
          htmlDom.setAttribute("dir", "ltr");
          rtlLink.href = "assets/css/vendors/bootstrap.min.css";
          localStorage.setItem("rtlcss", "assets/css/vendors/bootstrap.min.css");
          localStorage.setItem("dir", "ltr");
        }
      };
      dirSwitch.addEventListener("change", dirHandler);
    }

    const darkSwitch = document.querySelector("#dark-switch") as HTMLInputElement;
    const bodyDom = document.querySelector("body");
    if (darkSwitch && bodyDom) {
      const currentLayout = localStorage.getItem("layout_version");
      darkSwitch.checked = currentLayout === "dark";
      
      const darkHandler = (e: Event) => {
        const checkbox = e.target as HTMLInputElement;
        if (checkbox.checked) {
          bodyDom.classList.add("dark");
          localStorage.setItem("layout_version", "dark");
        } else {
          bodyDom.classList.remove("dark");
          localStorage.removeItem("layout_version");
        }
      };
      darkSwitch.addEventListener("change", darkHandler);
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLikeClick);
      document.removeEventListener('click', handlePlusMinusClick);
      document.removeEventListener('click', handleTrashClick);
      installapp?.removeEventListener("click", handleInstall);
    };
  }, [location.pathname]);
}
