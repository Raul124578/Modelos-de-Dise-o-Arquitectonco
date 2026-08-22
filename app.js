// ==========================================================================
// BLOG ACADÉMICO PROFESIONAL UML (NORMAS APA 7.ª EDICIÓN) - LÓGICA DE INTERACCIÓN
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCourseData();
    initMobileMenu();
    initScrollSpy();
    initBackToTop();
    initApaCitationTooltips();
    initActionDelegation();
});

/* ==========================================================================
   1. GESTIÓN DE TEMA CLARO / OSCURO (PARCHMENT APA LIGHT & OXFORD DARK)
   ========================================================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('blog-uml-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeBtnIcon(themeBtn, savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('blog-uml-theme', newTheme);
        updateThemeBtnIcon(themeBtn, newTheme);
        showToast(newTheme === 'dark' ? 'Modo Oscuro (Ejecutivo) activado' : 'Modo Claro (Estándar APA) activado');
    });
}

function updateThemeBtnIcon(btn, theme) {
    if (theme === 'dark') {
        btn.innerHTML = '<i class="fa-solid fa-sun"></i> Modo Claro';
    } else {
        btn.innerHTML = '<i class="fa-solid fa-moon"></i> Modo Oscuro';
    }
}

/* ==========================================================================
   2. FICHA GENERAL DE DATOS DEL CURSO (PERSONALIZACIÓN DINÁMICA)
   ========================================================================== */
const DEFAULT_COURSE_DATA = {
    curso: 'Análisis y Diseño de Sistemas II',
    
    estudiante: 'Miguel A.',
    ciclo: 'Primer Semestre 2026',
    fecha: 'Agosto 2026'
};

function initCourseData() {
    const savedData = localStorage.getItem('blog-uml-course-data');
    const data = savedData ? JSON.parse(savedData) : DEFAULT_COURSE_DATA;
    renderCourseData(data);
}

function renderCourseData(data) {
    const mapping = {
        'val-universidad': data.universidad,
        'val-facultad': data.facultad,
        'val-carrera': data.carrera,
        'val-curso': data.curso,
        'val-catedratico': data.catedratico,
        'val-estudiante': data.estudiante,
        'val-carne': data.carne,
        'val-ciclo': data.ciclo,
        'val-fecha': data.fecha
    };

    for (const [id, value] of Object.entries(mapping)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
}

function openEditCourseModal() {
    const modal = document.getElementById('modal-edit-course');
    if (!modal) return;

    const savedData = localStorage.getItem('blog-uml-course-data');
    const data = savedData ? JSON.parse(savedData) : DEFAULT_COURSE_DATA;

    document.getElementById('input-universidad').value = data.universidad || '';
    document.getElementById('input-facultad').value = data.facultad || '';
    document.getElementById('input-carrera').value = data.carrera || '';
    document.getElementById('input-curso').value = data.curso || '';
    document.getElementById('input-catedratico').value = data.catedratico || '';
    document.getElementById('input-estudiante').value = data.estudiante || '';
    document.getElementById('input-carne').value = data.carne || '';
    document.getElementById('input-ciclo').value = data.ciclo || '';
    document.getElementById('input-fecha').value = data.fecha || '';

    modal.classList.add('active');
}

function closeEditCourseModal() {
    const modal = document.getElementById('modal-edit-course');
    if (modal) modal.classList.remove('active');
}

function saveCourseData(e) {
    if (e) e.preventDefault();

    const data = {
        universidad: document.getElementById('input-universidad').value.trim() || DEFAULT_COURSE_DATA.universidad,
        facultad: document.getElementById('input-facultad').value.trim() || DEFAULT_COURSE_DATA.facultad,
        carrera: document.getElementById('input-carrera').value.trim() || DEFAULT_COURSE_DATA.carrera,
        curso: document.getElementById('input-curso').value.trim() || DEFAULT_COURSE_DATA.curso,
        catedratico: document.getElementById('input-catedratico').value.trim() || DEFAULT_COURSE_DATA.catedratico,
        estudiante: document.getElementById('input-estudiante').value.trim() || DEFAULT_COURSE_DATA.estudiante,
        carne: document.getElementById('input-carne').value.trim() || DEFAULT_COURSE_DATA.carne,
        ciclo: document.getElementById('input-ciclo').value.trim() || DEFAULT_COURSE_DATA.ciclo,
        fecha: document.getElementById('input-fecha').value.trim() || DEFAULT_COURSE_DATA.fecha
    };

    localStorage.setItem('blog-uml-course-data', JSON.stringify(data));
    renderCourseData(data);
    closeEditCourseModal();
    showToast('Ficha de Datos del Curso actualizada correctamente');
}

/* ==========================================================================
   3. HERRAMIENTAS Y CITACIÓN EN FORMATO APA 7.ª EDICIÓN
   ========================================================================== */
function copyApaCitation(elementId, label) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let textToCopy = el.innerText || el.textContent;
    textToCopy = textToCopy.replace('Copiar APA', '').trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Cita APA (${label}) copiada al portapapeles`);
    }).catch(err => {
        console.error('Error al copiar cita: ', err);
    });
}

function copyBlogApaCitation() {
    const blogCiteText = document.getElementById('blog-apa-citation-text');
    if (!blogCiteText) return;

    const textToCopy = blogCiteText.innerText.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Referencia APA del blog copiada al portapapeles');
    });
}

function initApaCitationTooltips() {
    const inlineCites = document.querySelectorAll('.apa-cite');
    inlineCites.forEach(cite => {
        cite.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = cite.getAttribute('href');
            if (!targetId) return;

            const targetRef = document.querySelector(targetId);
            if (targetRef) {
                targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetRef.classList.add('highlighted-ref');
                setTimeout(() => {
                    targetRef.classList.remove('highlighted-ref');
                }, 3000);
            }
        });
    });
}

/* ==========================================================================
   4. MODAL VISOR DE DIAGRAMAS SVG HD
   ========================================================================== */
function openDiagramModal(svgWrapperId, titleText) {
    const modal = document.getElementById('diagram-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const wrapper = document.getElementById(svgWrapperId);

    if (wrapper && modal) {
        const originalSvg = wrapper.querySelector('svg');
        if (originalSvg) {
            modalTitle.textContent = titleText;
            modalBody.innerHTML = originalSvg.outerHTML;
            modal.classList.add('active');
        }
    }
}

function closeDiagramModal() {
    const modal = document.getElementById('diagram-modal');
    if (modal) modal.classList.remove('active');
}

/* Close Modals on Escape Key */
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDiagramModal();
        closeEditCourseModal();
    }
});

/* ==========================================================================
   5. NAVEGACIÓN, MENÚ MÓVIL Y BOTÓN BACK TO TOP
   ========================================================================== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('mobile-open');
            const icon = mobileToggle.querySelector('i');
            if (sidebar.classList.contains('mobile-open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id], article[id]');
    const navLinks = document.querySelectorAll('.toc-list a, .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 130;
            if (scrollPos >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (!backBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================================================================
   6. TOAST NOTIFICACIÓN INTERACTIVA
   ========================================================================== */
function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ==========================================================================
   7. DELEGACIÓN DE EVENTOS DE INTERFAZ (SIN CÓDIGO INLINE)
   ========================================================================== */
function initActionDelegation() {
    document.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.getAttribute('data-action');
        
        if (action === 'open-edit-course') {
            openEditCourseModal();
        } else if (action === 'close-edit-course') {
            closeEditCourseModal();
        } else if (action === 'open-diagram') {
            const diagramId = actionBtn.getAttribute('data-diagram-id');
            const title = actionBtn.getAttribute('data-diagram-title');
            openDiagramModal(diagramId, title);
        } else if (action === 'close-diagram') {
            closeDiagramModal();
        } else if (action === 'copy-apa') {
            const citationId = actionBtn.getAttribute('data-citation-id');
            const label = actionBtn.getAttribute('data-citation-label');
            copyApaCitation(citationId, label);
        } else if (action === 'copy-blog-apa') {
            copyBlogApaCitation();
        }
    });

    const editCourseForm = document.getElementById('form-edit-course');
    if (editCourseForm) {
        editCourseForm.addEventListener('submit', (e) => {
            saveCourseData(e);
        });
    }
}

