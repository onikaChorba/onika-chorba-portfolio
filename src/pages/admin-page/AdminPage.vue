<template>
  <div class="admin">
    <form @submit.prevent="saveProject" class="form">
      <input v-model="form.name" placeholder="Name" required />
      <textarea v-model="textEnInput" placeholder="Text (English)"></textarea>
      <textarea v-model="textUkInput" placeholder="Text (Ukrainian)"></textarea>
      <input v-model="tagsInput" placeholder="Tags (comma separated)" />

      <textarea v-model="imgsInput" placeholder="Image URLs (one per line)"></textarea>

      <textarea v-model="linksInput" placeholder="Links: browser, GitHub (one per line)"></textarea>

      <textarea v-model="toolsEnInput" placeholder="Tools (English, one per line)"></textarea>
      <textarea v-model="toolsUkInput" placeholder="Tools (Ukrainian, one per line)"></textarea>

      <div class="form-buttons">
        <button type="submit">{{ editingId ? "Update" : "Add" }} Project</button>
        <button v-if="editingId" type="button" @click="cancelEdit">Cancel</button>
      </div>
    </form>

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
import { Project } from "../../types";
import { ref, reactive, onMounted } from "vue";
import { db } from "../../firebase/firebase.config";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const projects = ref<Project[]>([]);
const projectsCol = collection(db, "projects");

const toolsEnInput = ref("");
const toolsUkInput = ref("");
const textEnInput = ref("");
const textUkInput = ref("");

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
}

function cancelEdit() {
  resetForm();
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

.form {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  background: var(--content-bg);
  border-radius: 16px;
  box-shadow: var(--box-shadow);
  margin-bottom: 2.5rem;
}

.form input,
.form textarea {
  padding: 0.9rem 1rem;
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

.projects {
  display: flex;
  gap: 1.5rem;
}

.project-wrapper {
  display: flex;
  justify-content: space-between;
  color: var(--color-text);
}

.projects li {
  width: 50%;
  list-style: none;
  background: var(--content-bg);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: var(--box-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tools li {
  width: 100%;
  list-style: circle;
  background: none;
  padding: 10px;
  border-radius: 0px;
  box-shadow: none;
  color: var(--color-text);
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
</style>
