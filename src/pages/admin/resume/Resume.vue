<template>
  <div class="resume-wrapper">
    <div class="controls">
      <button @click="downloadPdf" class="btn" :disabled="loading">Download PDF</button>
      <button @click="printPage" class="btn btn-ghost" :disabled="loading">Print</button>
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
</template>

<script setup lang="ts">
import { icons } from '@/icons';
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase.config';

const data = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const currentLang = 'en';

onMounted(async () => {
  try {
    const cvRef = doc(db, 'resume', 'cv');
    const snapshot = await getDoc(cvRef);

    if (!snapshot.exists()) {
      error.value = 'CV not found in Firestore';
      return;
    }

    const docData = snapshot.data();
    const langObj = docData.languages.find((l: any) => l.code === currentLang);
    data.value = langObj?.data ?? null;
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

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

function printPage() {
  window.print();
}
</script>

<style scoped lang="scss">
.resume-wrapper {
  padding: 18px;
  background: #f3f4f6;

  .controls {
    gap: 12px;
    margin-bottom: 14px;

    .btn {
      padding: 8px 12px;
      border-radius: 8px;
      border: none;
      background: var(--accent);
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
</style>