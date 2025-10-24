<template>
  <div class="resume-wrapper">
    <div class="controls">
      <button @click="downloadPdf" class="btn" :disabled="loading">Download PDF</button>
      <button @click="printPage" class="btn btn-ghost" :disabled="loading">Print</button>
      <button @click="showModal = true" class="btn btn-ghost">Edit CV</button>
      <select v-model="currentLang" class="currentLang">
        <option value="en">EN</option>
        <option value="ua">UA</option>
      </select>
    </div>

    <p v-if="loading">Loading CV…</p>
    <p v-if="error" style="color:red">{{ error }}</p>

    <article v-if="!loading && data" ref="printRef" class="resume a4" id="resume-to-pdf">
      <aside class="sidebar">
        <h1 class="name">{{ data.name }}</h1>
        <p class="role">{{ data.title }}</p>

        <div class="contacts">
          <p class="contact-cv">
            <img :src="icons.find(i => i.alt === 'telegram')?.src" class="icon" />
            <a :href="`https://t.me/${data.telegram}`" target="_blank" class="link">
              {{ data.telegram }}
            </a>
          </p>

          <p class="contact-cv">
            <img :src="icons.find(i => i.alt === 'location')?.src" class="icon" />
            <span>{{ data.location }}</span>
          </p>

          <p class="contact-cv">
            <img :src="icons.find(i => i.alt === 'email')?.src" class="icon" />
            <a :href="`mailto:${data.email}`" class="link">{{ data.email }}</a>
          </p>

          <p class="contact-cv">
            <img :src="icons.find(i => i.alt === 'linkedInCV')?.src" class="icon" />
            <a :href="data.linkedin" target="_blank" class="link">{{ data.linkedin }}</a>
          </p>

          <p class="contact-cv">
            <img :src="icons.find(i => i.alt === 'gitHubCV')?.src" class="icon" />
            <a :href="data.github" target="_blank" class="link">{{ data.github }}</a>
          </p>
        </div>
      </aside>

      <main class="content">
        <div class="content-flex-wrapper">
          <div class="content-flex">
            <div class="section-title">
              <h2 class="title">Summary</h2>
              <hr />
            </div>
            <p class="section-text">{{ data.summary }}</p>
          </div>

          <div class="content-flex">
            <div class="section-title">
              <h2 class="title">Skills</h2>
              <hr />
            </div>
            <ul class="list">
              <li v-for="(s, i) in data.skills" :key="i" class="tag">{{ s }}</li>
            </ul>
          </div>
        </div>

        <div class="content-flex-wrapper">
          <div class="content-flex">
            <div class="section-title">
              <h2 class="title">Languages</h2>
              <hr />
            </div>
            <ul class="list">
              <li v-for="(l, i) in data.languages" :key="i">{{ l }}</li>
            </ul>
          </div>

          <div class="content-flex">
            <div class="section-title">
              <h2 class="title">Education</h2>
              <hr />
            </div>
            <div class="edu-item">
              <b class="section-text">
                <b>{{ data.education.degree }}</b>,
                <span class="section-text">{{ data.education.school }}</span>
              </b>
            </div>
          </div>
        </div>

        <div class="wrapper">
          <div class="section-title">
            <h2 class="title">WORK EXPERIENCE</h2>
            <hr />
          </div>
          <div class="experience">
            <div v-for="(exp, idx) in data.experience" :key="idx" class="exp-item">
              <div class="experience-title">
                <h3 class="section-text-large"><b>{{ exp.role }}</b>, {{ exp.company }}</h3>
                <span class="section-text">{{ exp.period }}</span>
              </div>
              <p class="section-text skillset" v-if="exp.skillSet">
                <b>Skillset:</b> {{ exp.skillSet }}
              </p>
              <p class="section-text" v-if="exp.description">{{ exp.description }}</p>
              <ul class="list" v-if="exp.points?.length">
                <li v-for="(d, i) in exp.points" :key="i">{{ d }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="wrapper" v-if="data.hobbies?.length">
          <div class="section-title">
            <h2 class="title">Hobbies</h2>
            <hr />
          </div>
          <p class="section-text">{{ data.hobbies.join(', ') }}</p>
        </div>
      </main>
    </article>
  </div>

  <div v-if="showModal" class="modal-backdrop">
    <div class="modal">
      <h2>Edit CV ({{ currentLang.toUpperCase() }})</h2>
      <label>Name: <input v-model="editData.name" /></label>
      <label>Title: <input v-model="editData.title" /></label>
      <label>Summary: <textarea v-model="editData.summary"></textarea></label>

      <h3>Skills</h3>
      <div v-for="(s, i) in editData.skills" :key="i">
        <input v-model="editData.skills[i]" />
        <button @click="removeSkill(i)">Remove</button>
      </div>
      <button @click="addSkill">Add Skill</button>

      <h3>Experience</h3>
      <div v-for="(exp, i) in editData.experience" :key="i" class="exp-edit">
        <label>Role: <input v-model="exp.role" /></label>
        <label>Company: <input v-model="exp.company" /></label>
        <label>Period: <input v-model="exp.period" /></label>
        <label>SkillSet: <input v-model="exp.skillSet" /></label>
        <label>Description: <textarea v-model="exp.description"></textarea></label>
        <h4>Points</h4>
        <div v-for="(p, j) in exp.points" :key="j">
          <input v-model="exp.points[j]" />
          <button @click="removePoint(i, j)">Remove</button>
        </div>
        <button @click="addPoint(i)">Add Point</button>
        <button @click="removeExp(i)">Remove Experience</button>
      </div>
      <button @click="addExp">Add Experience</button>

      <h3>Hobbies</h3>
      <div v-for="(h, i) in editData.hobbies" :key="i">
        <input v-model="editData.hobbies[i]" />
        <button @click="removeHobby(i)">Remove</button>
      </div>
      <button @click="addHobby">Add Hobby</button>

      <div class="modal-actions">
        <button @click="saveCV">Save</button>
        <button @click="showModal = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { icons } from '@/icons';
import { ref, onMounted, watch } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase.config';

const data = ref<any>(null);
const editData = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const currentLang = ref('en');
const showModal = ref(false);

async function fetchCV() {
  loading.value = true;
  try {
    const cvRef = doc(db, 'resume', 'cv');
    const snapshot = await getDoc(cvRef);
    if (!snapshot.exists()) {
      error.value = 'CV not found';
      return;
    }
    const docData = snapshot.data();
    const langObj = docData.languages.find((l: any) => l.code === currentLang.value);
    data.value = langObj?.data ?? null;
    editData.value = JSON.parse(JSON.stringify(data.value));
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCV);
watch(currentLang, fetchCV);

function addSkill() { editData.value.skills.push(''); }
function removeSkill(i: number) { editData.value.skills.splice(i, 1); }

function addExp() { editData.value.experience.push({ role: '', company: '', period: '', skillSet: '', description: '', points: [] }); }
function removeExp(i: number) { editData.value.experience.splice(i, 1); }

function addPoint(expIdx: number) { editData.value.experience[expIdx].points.push(''); }
function removePoint(expIdx: number, i: number) { editData.value.experience[expIdx].points.splice(i, 1); }

function addHobby() { editData.value.hobbies.push(''); }
function removeHobby(i: number) { editData.value.hobbies.splice(i, 1); }

async function saveCV() {
  try {
    const cvRef = doc(db, 'resume', 'cv');
    const snapshot = await getDoc(cvRef);
    if (!snapshot.exists()) return;
    const docData = snapshot.data();
    const langIndex = docData.languages.findIndex((l: any) => l.code === currentLang.value);
    docData.languages[langIndex].data = editData.value;
    await updateDoc(cvRef, docData);
    data.value = JSON.parse(JSON.stringify(editData.value));
    showModal.value = false;
  } catch (e: any) {
    alert('Save failed: ' + e.message);
  }
}

const printRef = ref<HTMLElement | null>(null);
async function downloadPdf() {
  if (!printRef.value) return;
  const html2pdf = (await import('html2pdf.js')).default;
  html2pdf().from(printRef.value).set({
    margin: [10, 10, 10, 10],
    filename: `${data.value.name.replace(/\s+/g, '_')}_CV.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).save();
}
function printPage() { window.print(); }
</script>

<style scoped lang="scss">
.resume-wrapper {
  padding: 18px;
  background: #f3f4f6;

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 14px;

    .btn {
      padding: 8px 12px;
      border-radius: 8px;
      border: none;
      background: var(--color-primary);
      color: #fff;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-ghost {
      background: transparent;
      border: 1px solid #ddd;
      color: var(--muted-2);
    }
  }
}

.resume {
  font-family: Arial, Helvetica, sans-serif;
  background: var(--paper-bg);
  padding: var(--page-padding);
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.08);
  color: var(--text-color);
  max-width: 900px;
  margin: 0 auto;
  box-sizing: border-box;
}

.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;

  .name {
    margin: 0;
    padding-top: 40px;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0.6px;
  }

  .role {
    text-transform: uppercase;
    color: var(--color-primary);
    font-weight: 700;
    font-size: 14px;
    margin-top: 5px;
    margin-bottom: 14px;
  }

  .contacts {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    max-width: 700px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 12px;
    font-weight: 600;
  }

  .contact-cv {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .icon {
    width: 25px;
    height: 25px;
    display: inline-block;
  }

  .link {
    display: inline-block;
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 20px;
}

.content-flex-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.experience {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-flex {
  box-sizing: border-box;
  width: 45%;
}

.section-title {
  text-transform: uppercase;
  font-size: 14px;
  color: var(--color-primary);

  hr {
    margin-top: 5px;
    margin-bottom: 15px;
    background: var(--color-primary);
    height: 2px;
    border: none;
  }
}

.section-text {
  font-size: 14px;
  line-height: 24px;
  color: var(--text-color);
  font-weight: 400;
}

.section-text-large {
  font-size: 16px;
  line-height: 26px;
  color: var(--text-color);
  font-weight: 600;
}

.list {
  padding-left: 15px;
  font-size: 14px;
  line-height: 24px;
  color: var(--text-color);
  font-weight: 400;

  li {
    padding-top: 3px;
  }
}

.experience-title,
.skillset {
  margin-bottom: 10px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;
}

.modal {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  padding: 30px 40px;
  font-family: 'Arial', sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal h2 {
  margin: 0 0 10px 0;
  font-size: 22px;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 5px;
}

.modal h3 {
  margin: 15px 0 5px 0;
  font-size: 18px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal h4 {
  margin: 10px 0 3px 0;
  font-size: 16px;
  color: #666;
}

label {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
}

input,
textarea,
select {
  margin-top: 5px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 5px rgba(255, 102, 0, 0.3);
}

button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

button:hover {
  opacity: 0.85;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.btn-secondary {
  background: #f3f3f3;
  color: #333;
  border: 1px solid #ddd;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.exp-edit {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  background: #fafafa;
}

.exp-edit label {
  font-weight: 500;
}

.exp-edit input,
.exp-edit textarea {
  font-size: 13px;
}

.exp-edit button {
  margin-top: 5px;
  font-size: 12px;
  padding: 4px 8px;
  background: var(--color-primary);
  color: #fff;
}

.exp-edit button:hover {
  background: var(--color-primary);
}

button.add-btn {
  background: #4caf50;
  color: #fff;
  font-size: 13px;
  padding: 6px 12px;
}

button.add-btn:hover {
  background: #43a047;
}

.currentLang {
  width: 100px;
  margin-top: 0px;
}
</style>