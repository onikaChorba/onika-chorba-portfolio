<template>
  <footer class="footer">
    <div class="footer__content">
      <p class="footer__text">© 2025 Onika Chorba</p>
      <div class="footer__links">
        <a href="https://github.com/onikaChorba" target="_blank">GitHub</a>
        <a href="https://www.linkedin.com/in/оnika-chorba" target="_blank">LinkedIn</a>
        <a href="mailto:onika.chorba@gmail.com">Email</a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  padding: 1rem 2rem;
  background: var(--content-bg);
  color: var(--color-text);
  box-shadow: var(--box-shadow);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;

  &__content {
    max-width: 1200px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__text {
    font-size: 0.9rem;
  }

  &__links {
    display: flex;
    gap: 1rem;

    a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;

      &:hover {
        color: var(--color-btn-hover-bg);
      }
    }
  }
}

@media (max-width: 768px) {
  .footer__content {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
