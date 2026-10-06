const githubProjects = document.querySelector('.github-projects');

if (githubProjects) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') githubProjects.classList.add('preview-dismissed');
  });
  githubProjects.addEventListener('pointerleave', () => {
    githubProjects.classList.remove('preview-dismissed');
  });
  githubProjects.addEventListener('focusout', () => {
    githubProjects.classList.remove('preview-dismissed');
  });
}
