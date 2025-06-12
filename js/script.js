document.addEventListener("DOMContentLoaded", function () {
  // Hero Slider
  const slides = document.querySelectorAll(".hero-slider .slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) {
        slide.classList.add("active");
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  if (slides.length > 0) {
    showSlide(currentSlide);
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  // Property Search and Filtering Functionality
  const searchInput = document.getElementById("property-search");
  const searchBtn = document.getElementById("search-btn");
  const propertyTypeSelect = document.getElementById("property-type");
  const bedroomsSelect = document.getElementById("bedrooms");
  const priceRangeSelect = document.getElementById("price-range");
  const propertyCards = document.querySelectorAll(".property-card");
  const filterTags = document.querySelectorAll(".filter-tag");
  const clearFiltersBtn = document.getElementById("clear-filters");
  const resetSearchBtn = document.getElementById("reset-search");
  const searchResultsInfo = document.getElementById("search-results");
  const resultsCount = document.querySelector(".results-count");
  const propertyGrid = document.getElementById("property-grid");
  const noResultsMessage = document.getElementById("no-results");

  // Property data (simulated database)
  const properties = [
    {
      id: 1,
      title: "Modern Family Home",
      price: 550000,
      bedrooms: 4,
      type: "house",
      featured: true,
      location: "Pleasantville, Anytown",
      features: "modern, family, spacious, garage",
    },
    {
      id: 2,
      title: "Luxury Downtown Apartment",
      price: 750000,
      bedrooms: 2,
      type: "apartment",
      featured: true,
      location: "Downtown, Anytown",
      features: "luxury, modern, view, concierge",
    },
    {
      id: 3,
      title: "Cozy Suburban House",
      price: 420000,
      bedrooms: 3,
      type: "house",
      featured: false,
      location: "Pleasantville, Anytown",
      features: "cozy, backyard, suburban, family",
    },
  ];

  // Combined filter function
  function filterProperties() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const propertyType = propertyTypeSelect ? propertyTypeSelect.value : "";
    const bedrooms =
      bedroomsSelect && bedroomsSelect.value
        ? parseInt(bedroomsSelect.value)
        : 0;
    const priceRange = priceRangeSelect ? priceRangeSelect.value : "";

    // Get active tag filter
    let tagFilter = "all";
    filterTags.forEach((tag) => {
      if (tag.classList.contains("active")) {
        tagFilter = tag.getAttribute("data-filter");
      }
    });

    let minPrice = 0;
    let maxPrice = Infinity;

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      minPrice = min;
      maxPrice = max || Infinity;
    }

    let visibleCount = 0;

    propertyCards.forEach((card) => {
      const cardType = card.getAttribute("data-type");
      const cardBedrooms = parseInt(card.getAttribute("data-bedrooms"));
      const cardPrice = parseInt(card.getAttribute("data-price"));
      const cardFeatured = card.getAttribute("data-featured") === "true";

      // Get property title and other searchable content
      const cardTitle = card.querySelector("h3").textContent.toLowerCase();

      // Check if property matches all filters
      const matchesSearch = !searchTerm || cardTitle.includes(searchTerm);

      const matchesType = !propertyType || cardType === propertyType;
      const matchesBedrooms = !bedrooms || cardBedrooms >= bedrooms;
      const matchesPrice = cardPrice >= minPrice && cardPrice <= maxPrice;
      const matchesTag =
        tagFilter === "all" ||
        (tagFilter === "featured" && cardFeatured) ||
        cardType === tagFilter;

      if (
        matchesSearch &&
        matchesType &&
        matchesBedrooms &&
        matchesPrice &&
        matchesTag
      ) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Update results count
    if (resultsCount) {
      if (visibleCount === propertyCards.length) {
        resultsCount.textContent = `Showing all properties`;
      } else {
        resultsCount.textContent = `Showing ${visibleCount} of ${propertyCards.length} properties`;
      }
    }

    // Show/hide no results message
    if (noResultsMessage && propertyGrid) {
      if (visibleCount === 0) {
        propertyGrid.style.display = "none";
        noResultsMessage.style.display = "block";
      } else {
        propertyGrid.style.display = "grid";
        noResultsMessage.style.display = "none";
      }
    }

    // Show/hide clear filters button
    if (clearFiltersBtn) {
      const isFiltered =
        searchTerm ||
        propertyType ||
        bedrooms ||
        priceRange ||
        tagFilter !== "all";
      clearFiltersBtn.style.display = isFiltered ? "flex" : "none";
    }
  }

  // Reset all filters
  function resetFilters() {
    if (searchInput) searchInput.value = "";
    if (propertyTypeSelect) propertyTypeSelect.value = "";
    if (bedroomsSelect) bedroomsSelect.value = "";
    if (priceRangeSelect) priceRangeSelect.value = "";

    // Reset tag filters
    filterTags.forEach((tag) => {
      tag.classList.remove("active");
      if (tag.getAttribute("data-filter") === "all") {
        tag.classList.add("active");
      }
    });

    filterProperties();
  }

  // Event listeners for search and filters
  if (searchBtn) {
    searchBtn.addEventListener("click", filterProperties);
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        filterProperties();
      }
    });
  }

  // Filters change event
  const dropdownFilters = [
    propertyTypeSelect,
    bedroomsSelect,
    priceRangeSelect,
  ];
  dropdownFilters.forEach((filter) => {
    if (filter) {
      filter.addEventListener("change", filterProperties);
    }
  });

  // Filter tag click events
  filterTags.forEach((tag) => {
    tag.addEventListener("click", function () {
      filterTags.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      filterProperties();
    });
  });

  // Clear filters button
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", resetFilters);
  }

  // Reset search button
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", resetFilters);
  }

  // Initialize filters
  filterProperties();

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      navMenu.classList.toggle("active");

      // Toggle between hamburger and close icon
      const icon = this.querySelector("i");
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  // Active Navigation Link
  const navLinks = document.querySelectorAll(".nav-menu li a");
  const sections = document.querySelectorAll("section[id]");

  function setActiveLink() {
    let scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);

  // Call initially to set the active link on page load
  setActiveLink();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu when clicking a link
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        if (mobileMenuBtn) {
          const icon = mobileMenuBtn.querySelector("i");
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        inquiryType: document.getElementById("inquiry-type").value,
        message: document.getElementById("message").value,
      };

      // Form validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.inquiryType ||
        !formData.message
      ) {
        showFormError("Please fill out all required fields.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showFormError("Please enter a valid email address.");
        return;
      }

      // Phone validation (if provided)
      if (formData.phone) {
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
          showFormError("Please enter a valid phone number.");
          return;
        }
      }

      // Simulate form submission (in a real scenario, this would send data to a server)
      submitForm(formData);
    });
  }

  function submitForm(formData) {
    // In a real application, you would send this data to your server
    // Since we don't have a backend, we'll simulate a successful submission

    // Show loading state
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }

    // Simulate network request
    setTimeout(function () {
      // Hide loading state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Send Message";
      }

      // Show success message
      showFormSuccess();

      // Reset form
      contactForm.reset();

      // Log form data (for demonstration purposes)
      console.log("Form submitted with data:", formData);
    }, 1500);
  }

  function showFormSuccess() {
    if (formSuccess) {
      formSuccess.style.display = "flex";
      formError.style.display = "none";

      // Auto-hide success message after 5 seconds
      setTimeout(function () {
        formSuccess.style.display = "none";
      }, 5000);
    }
  }

  function showFormError(message) {
    if (formError) {
      const errorText = formError.querySelector("p");
      if (errorText) {
        errorText.textContent = message;
      }

      formError.style.display = "flex";
      formSuccess.style.display = "none";
    }
  }
});

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  document.body.style.overflow = "auto"; // Restore scrolling
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
};
