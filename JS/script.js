document.addEventListener('DOMContentLoaded', function() {
    // ===== BARRA DE NAVEGACIÓN FIJA =====
    const header = document.querySelector('.header');
    const navbarFixed = document.createElement('nav');
    navbarFixed.className = 'navbar-fixed';
    navbarFixed.innerHTML = `
        <div class="container">
            <ul>
                <li><a href="#inicio" class="active">Inicio</a></li>
                <li><a href="#cancer">Por tipo de cáncer</a></li>
                <li><a href="#vegano">Opciones veganas</a></li>
                <li><a href="#prevencion">Prevención</a></li>
                <li><a href="#recetas">Todas las recetas</a></li>
                <li><a href="contacto.html">Contacto</a></li>
            </ul>
        </div>
    `;
    
    document.body.appendChild(navbarFixed);
    
    // Mostrar barra fija al hacer scroll
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Ocultar al subir, mostrar al bajar
        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
            navbarFixed.classList.remove('show');
        } else if (currentScrollY > 50) {
            navbarFixed.classList.add('show');
        } else {
            navbarFixed.classList.remove('show');
        }
        
        // Actualizar clase del header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // ===== BÚSQUEDA MEJORADA CON RESULTADOS =====
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    // Base de datos de recetas para búsqueda
    const recipesDB = [
        { id: 1, title: "Sopa de Lentejas Energética", desc: "Perfecta para días sin mucho apetito. Rica en proteínas y hierro.", tags: ["sopa", "lentejas", "energética", "proteínas", "hierro"], url: "recetas/sopa-lentejas.html" },
        { id: 2, title: "Batido Anti-Náuseas", desc: "Con jengibre y plátano. Ideal para momentos difíciles.", tags: ["batido", "jengibre", "plátano", "anti-náuseas"], url: "recetas/batido-anti-nauseas.html" },
        { id: 3, title: "Curry de Garbanzos", desc: "Rico en licopeno y antioxidantes. Perfecto para próstata.", tags: ["curry", "garbanzos", "licopeno", "antioxidantes", "próstata"], url: "recetas/curry-garbanzos.html" },
        { id: 4, title: "Avena con Plátano", desc: "Desayuno energético y fácil de digerir.", tags: ["avena", "plátano", "desayuno", "energético"], url: "recetas/avena-platano.html" },
        { id: 5, title: "Sopa de Miso con Vegetales", desc: "Caliente, reconfortante y rica en probióticos.", tags: ["sopa", "miso", "vegetales", "probióticos"], url: "recetas/sopa-miso.html" },
        { id: 6, title: "Salmón al Horno con Camote", desc: "Omega-3 y fibra. Excelente para colon saludable.", tags: ["salmón", "camote", "omega-3", "fibra", "colon"], url: "recetas/salmon-camote.html" }
    ];
    
    // Función para buscar recetas
    function searchRecipes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            searchResults.innerHTML = '';
            applyFilters(); // Volver a aplicar filtros
            return;
        }
        
        // Filtrar recetas
        const results = recipesDB.filter(recipe => {
            const titleMatch = recipe.title.toLowerCase().includes(searchTerm);
            const descMatch = recipe.desc.toLowerCase().includes(searchTerm);
            const tagsMatch = recipe.tags.some(tag => tag.includes(searchTerm));
            return titleMatch || descMatch || tagsMatch;
        });
        
        // Mostrar/Ocultar tarjetas existentes
        recipeCards.forEach(card => {
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            if (cardTitle.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mostrar resultados en la sección de búsqueda
        if (results.length > 0) {
            searchResults.innerHTML = `
                <h4 style="text-align: center; color: var(--color-primary); margin-bottom: 15px;">
                    🎯 Se encontraron ${results.length} resultado(s)
                </h4>
                ${results.map(recipe => `
                    <div class="search-result">
                        <h4>${recipe.title}</h4>
                        <p>${recipe.desc}</p>
                        <a href="${recipe.url}" class="btn-detail">Ver receta →</a>
                    </div>
                `).join('')}
            `;
        } else {
            searchResults.innerHTML = `
                <p style="text-align: center; color: var(--color-primary);">
                    😔 No se encontraron recetas con "${searchTerm}"
                </p>
            `;
        }
    }
    
    // Eventos de búsqueda
    if (searchInput) {
        searchInput.addEventListener('keyup', searchRecipes);
        searchInput.addEventListener('input', searchRecipes);
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', searchRecipes);
    }
    
    // ===== CORRECCIÓN DEL BANCO DE RECETAS (FILTROS COMBINADOS) =====
    let activeBudgetFilter = 'all';
    let activeVeganFilter = 'all';
    
    // Función para aplicar AMBOS filtros
    function applyFilters() {
        recipeCards.forEach(card => {
            const price = card.getAttribute('data-price');
            const vegano = card.getAttribute('data-vegano');
            
            // Verificar si cumple con el filtro de presupuesto
            const matchesBudget = activeBudgetFilter === 'all' || price === activeBudgetFilter;
            
            // Verificar si cumple con el filtro vegano
            const matchesVegan = activeVeganFilter === 'all' || 
                                (activeVeganFilter === 'vegano-si' && vegano === 'si');
            
            // Mostrar solo si cumple AMBOS filtros
            card.style.display = matchesBudget && matchesVegan ? 'block' : 'none';
        });
    }
    
    // Manejar filtros de PRESUPUESTO
    document.querySelectorAll('.filter-group[data-filter-type="budget"] .filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Actualizar filtro activo
            activeBudgetFilter = this.getAttribute('data-filter');
            
            // Actualizar UI
            document.querySelectorAll('.filter-group[data-filter-type="budget"] .filter-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            this.classList.add('active');
            
            // Aplicar filtros combinados
            applyFilters();
        });
    });
    
    // Manejar filtros de VEGANO
    document.querySelectorAll('.filter-group[data-filter-type="vegan"] .filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Actualizar filtro activo
            activeVeganFilter = this.getAttribute('data-filter');
            
            // Actualizar UI
            document.querySelectorAll('.filter-group[data-filter-type="vegan"] .filter-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            this.classList.add('active');
            
            // Aplicar filtros combinados
            applyFilters();
        });
    });
    
    // Inicializar filtros al cargar la página
    applyFilters();
    
    // ===== BOTONES DE FAVORITOS =====
    // Agregar botones de favoritos a todas las tarjetas
    recipeCards.forEach((card, index) => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'btn-favorite';
        favoriteBtn.innerHTML = '☆ Añadir a favoritos';
        favoriteBtn.setAttribute('data-id', index + 1);
        
        card.appendChild(favoriteBtn);
        
        // Cargar estado de favoritos desde localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes((index + 1).toString())) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '★ En favoritos';
        }
        
        // Evento de clic
        favoriteBtn.addEventListener('click', function() {
            this.classList.toggle('favorited');
            
            if (this.classList.contains('favorited')) {
                this.innerHTML = '★ En favoritos';
            } else {
                this.innerHTML = '☆ Añadir a favoritos';
            }
            
            // Guardar en localStorage
            const recipeId = this.getAttribute('data-id');
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            if (this.classList.contains('favorited')) {
                if (!favorites.includes(recipeId)) {
                    favorites.push(recipeId);
                }
            } else {
                favorites = favorites.filter(id => id !== recipeId);
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });
    
    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== ACTIVE MENU ON SCROLL =====
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a, .navbar-fixed a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // ===== MENSAJE DE BIENVENIDA ACTUALIZADO =====
    setTimeout(() => {
        console.log('❤️ ¡Bienvenido a OncoRecetas!');
        console.log('💙 Nutrición con corazón para acompañarte en tu camino.');
        console.log('📱 WhatsApp: 952 724 874');
        console.log('📧 Email: oncorecetas.lcc@gmail.com');
        console.log('🌐 Facebook: https://www.facebook.com/share/1CH7q8jcSw/');
        console.log('🎵 TikTok: https://www.tiktok.com/@oncorecetas.lcc');
    }, 1000);
    
    // ===== BOTÓN VOLVER ARRIBA =====
    const backToTop = document.createElement('button');
    backToTop.textContent = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--color-primary);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: none;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 999;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTop.addEventListener('mouseover', () => {
        backToTop.style.transform = 'scale(1.1)';
        backToTop.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
    });
    
    backToTop.addEventListener('mouseout', () => {
        backToTop.style.transform = 'scale(1)';
        backToTop.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
    });
});