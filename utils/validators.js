export const validator = {
  projectName: (name) => {
    if (!name) return 'Project name is required';
    if (!/^[a-z0-9-]+$/.test(name)) {
      return 'Project name can only contain lowercase letters, numbers, and hyphens';
    }
    return true;
  }
};
