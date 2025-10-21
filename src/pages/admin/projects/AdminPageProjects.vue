<template>
  <div class="admin">
    <button class="open-popup-btn" @click="openPopup">+ Add Project</button>
    <div v-if="isPopupOpen" class="popup-overlay" @click.self="closePopup">
      <div class="popup-content">
        <form @submit.prevent="saveProject" class="form">
          <h2>{{ editingId ? "Edit Project" : "Add Project" }}</h2>

          <input v-model="form.name" placeholder="Name" required />
          <textarea v-model="textEnInput" placeholder="Text (English)"></textarea>
          <textarea v-model="textUkInput" placeholder="Text (Ukrainian)"></textarea>
          <input v-model="tagsInput" placeholder="Tags (comma separated)" />
          <textarea v-model="imgsInput" placeholder="Image URLs (one per line)"></textarea>
          <textarea v-model="linksInput" placeholder="Links: browser, GitHub (one per line)"></textarea>
          <textarea v-model="toolsEnInput" placeholder="Tools (English, one per line)"></textarea>
          <textarea v-model="toolsUkInput" placeholder="Tools (Ukrainian, one per line)"></textarea>

          <div class="form-buttons">
            <button type="submit">{{ editingId ? "Update" : "Add" }}</button>
            <button type="button" @click="closePopup">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <ul class="projects">
      <li v-for="project in projects" :key="project.id">
        <div class="project-wrapper">
          <div class="project">
            <h3>{{ project.name }}</h3>
            <p>{{ project.text.uk }}</p>

            <div class="tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>

            <div class="imgs" v-if="project.imgs?.length">
              <img v-for="(img, index) in project.imgs" :key="index" :src="img" />
            </div>

            <div class="links">
              <a v-if="project.links?.browser" :href="project.links.browser" target="_blank">🌍</a>
              <a v-if="project.links?.gitHub" :href="project.links.gitHub" target="_blank">💻</a>
            </div>
          </div>
          <div>
            <ul class="tools">
              <li v-for="(tool, index) in project.tools?.en" :key="index">{{ tool }}</li>
            </ul>
          </div>
        </div>
        <div class="actions">
          <button @click="editProject(project)">Edit</button>
          <button @click="deleteProject(project.id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Project } from "../../../types";
import { ref, reactive, onMounted } from "vue";
import { db } from "../../../firebase/firebase.config";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const projects = ref<Project[]>([]);
const projectsCol = collection(db, "projects");

const toolsEnInput = ref("");
const toolsUkInput = ref("");
const textEnInput = ref("");
const textUkInput = ref("");
const isPopupOpen = ref(false);
const form = reactive<Project>({
  name: "",
  text: {
    en: "",
    uk: "",
  },
  tags: [],
  imgs: [],
  links: { browser: "", gitHub: "" },
  tools: {
    en: [],
    uk: [],
  },
});

const tagsInput = ref("");
const imgsInput = ref("");
const linksInput = ref("");
const toolsInput = ref("");
const editingId = ref<string | null>(null);

async function loadProjects() {
  const snap = await getDocs(projectsCol);
  projects.value = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

async function saveProject() {
  form.tags = tagsInput.value.split(",").map(t => t.trim()).filter(Boolean);
  form.tools = {
    en: toolsEnInput.value.split("\n").map(t => t.trim()).filter(Boolean),
    uk: toolsUkInput.value.split("\n").map(t => t.trim()).filter(Boolean),
  };

  form.text = {
    en: textEnInput.value.trim(),
    uk: textUkInput.value.trim(),
  };

  form.imgs = imgsInput.value.split("\n").map(i => i.trim()).filter(Boolean);

  const linksArr = linksInput.value.split("\n").map(l => l.trim()).filter(Boolean);
  form.links.browser = linksArr[0] || "";
  form.links.gitHub = linksArr[1] || "";

  if (editingId.value) {
    const refDoc = doc(db, "projects", editingId.value);
    await updateDoc(refDoc, { ...form });
  } else {
    await addDoc(projectsCol, {
      ...form,
      createdAt: new Date().toISOString(),
    });
  }

  resetForm();
  await loadProjects();
}

function openPopup() {
  resetForm();
  isPopupOpen.value = true;
}

function closePopup() {
  isPopupOpen.value = false;
  editingId.value = null;
}

function editProject(project: Project) {
  editingId.value = project.id || null;
  form.name = project.name;
  form.text = {
    en: project.text.en,
    uk: project.text.uk,
  };
  form.links = {
    browser: project.links?.browser || "",
    gitHub: project.links?.gitHub || "",
  };
  tagsInput.value = project.tags.join(", ");
  textEnInput.value = project.text.en;
  textUkInput.value = project.text.uk;
  toolsEnInput.value = project.tools?.en?.join("\n") || "";
  toolsUkInput.value = project.tools?.uk?.join("\n") || "";
  imgsInput.value = project.imgs?.join("\n") || "";
  linksInput.value = [form.links.browser, form.links.gitHub].join("\n");
  isPopupOpen.value = true;
}

async function deleteProject(id?: string) {
  if (!id) return;
  await deleteDoc(doc(db, "projects", id));
  await loadProjects();
}

function resetForm() {
  form.name = "";
  form.text = {
    en: "",
    uk: "",
  };
  form.tags = [];
  form.imgs = [];
  form.links = { browser: "", gitHub: "" };
  form.tools = {
    en: [],
    uk: [],
  };
  textEnInput.value = "";
  textUkInput.value = "";
  toolsEnInput.value = "";
  toolsUkInput.value = "";
  tagsInput.value = "";
  toolsInput.value = "";
  imgsInput.value = "";
  linksInput.value = "";
  editingId.value = null;
}

onMounted(loadProjects);
</script>

<style scoped>
.admin {
  padding: 2rem;
  max-width: 1550px;
  margin: 0 auto;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  text-align: center;
}

.open-popup-btn {
  background: var(--color-primary);
  color: white;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-bottom: 2rem;
}

.open-popup-btn:hover {
  background: var(--color-btn-hover-bg);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: var(--content-bg);
  border-radius: 16px;
  padding: 1.5rem;
  width: 90%;
  max-width: 1000px;
  max-height: 95vh;
  overflow-y: scroll;
  box-shadow: var(--box-shadow);
  animation: fadeIn 0.25s ease;
}

.form {
  display: grid;
  gap: 1rem;
  background: var(--content-bg);
  border-radius: 16px;
  margin-bottom: 2.5rem;
}

.form input,
.form textarea {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--color-btn-border);
  background: transparent;
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
}

.form input:focus,
.form textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--overlay-color);
}

.form textarea {
  min-height: 100px;
}

.form-buttons {
  display: flex;
  gap: 1rem;
}

.form button {
  flex: 1;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.form button[type="submit"] {
  background: var(--color-primary);
  color: #fff;
  border: none;
}

.form button[type="submit"]:hover {
  background: var(--color-btn-hover-bg);
  color: var(--color-btn-hover-text);
}

.form button[type="button"] {
  background: transparent;
  border: 1px solid var(--color-btn-border);
  color: var(--color-text);
}

.form button[type="button"]:hover {
  background: var(--color-btn-hover-bg);
  color: var(--color-btn-hover-text);
}

.project-wrapper {
  display: flex;
  justify-content: space-between;
  color: var(--color-text);
}

.projects {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.projects li {
  flex: 1 1 calc(50% - 1.5rem);
  max-width: calc(50% - 1.5rem);
  list-style: none;
  background: var(--content-bg);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: var(--box-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project {
  min-width: 200px;
}

.tools {
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-primary);
    border-radius: 8px;
    border: 2px solid var(--color-bg);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-btn-hover-bg);
  }
}

.tools li {
  flex: 1 1 100%;
  max-width: 100%;
  width: 100%;
  list-style: none;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  margin-bottom: 1rem;
}

.tools li:hover {
  box-shadow: none;
  transform: none;
}

.projects li:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.projects h3 {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  color: var(--color-primary);
}

.projects p {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.tags span {
  display: inline-block;
  margin: 0 0.4rem 0.4rem 0;
  font-size: 0.85rem;
  background: var(--tag-bg);
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
}

.imgs {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.imgs img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--color-btn-border);
}

.links {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.links a {
  font-size: 1.3rem;
  transition: transform 0.2s ease;
  text-decoration: none;
}

.links a:hover {
  transform: scale(1.2);
}

.actions {
  display: flex;
  gap: 0.8rem;
}

.actions button {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid var(--color-btn-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.25s ease;
  font-weight: 500;
}

.actions button:hover {
  background: var(--color-btn-hover-bg);
  color: var(--color-btn-hover-text);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .admin {
    padding: 1.5rem;
  }

  .projects li {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .popup-content {
    padding: 1.2rem;
    max-width: 90%;
  }

  h1 {
    font-size: 1.9rem;
  }

  .form button {
    font-size: 0.95rem;
  }

  .imgs img {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 768px) {
  .admin {
    padding: 1rem;
  }

  h1 {
    font-size: 1.7rem;
  }

  .open-popup-btn {
    width: 100%;
    font-size: 1rem;
    padding: 0.8rem 1rem;
  }

  .popup-content {
    width: 95%;
    max-height: 90vh;
    padding: 1rem;
  }

  .projects {
    flex-direction: column;
  }

  .projects li {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .project-wrapper {
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-buttons {
    flex-direction: column;
  }

  .form button {
    width: 100%;
  }

  .links {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .links a {
    font-size: 1.1rem;
  }

  .imgs img {
    width: 65px;
    height: 65px;
  }
}

/* Дуже малі екрани */
@media (max-width: 480px) {
  .admin {
    padding: 0.8rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .open-popup-btn {
    font-size: 0.95rem;
    padding: 0.7rem 0.9rem;
  }

  .form input,
  .form textarea {
    font-size: 0.95rem;
    padding: 0.4rem 0.8rem;
  }

  .projects li {
    padding: 1rem;
  }

  .projects h3 {
    font-size: 1.2rem;
  }

  .projects p {
    font-size: 0.95rem;
  }

  .imgs img {
    width: 60px;
    height: 60px;
  }

  .actions {
    flex-direction: column;
  }

  .actions button {
    width: 100%;
  }

  .tools li {
    padding: 0.8rem;
  }
}
</style>
