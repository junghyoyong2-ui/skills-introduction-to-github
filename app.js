const templateListEl = document.querySelector("#template-list");
const templateTitleEl = document.querySelector("#template-title");
const templateDescriptionEl = document.querySelector("#template-description");
const templateContentEl = document.querySelector("#template-content");
const messageEl = document.querySelector("#message");
const copyBtn = document.querySelector("#copy-btn");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#category-select");

const templates = [
  {
    id: "incident-summary",
    title: "사건 개요 1페이지 정리",
    category: "사건 관리",
    description: "사실관계, 쟁점, 리스크를 1페이지로 빠르게 요약합니다.",
    content: `다음 사실관계를 법무지원팀 내부 공유용으로 1페이지 요약해줘.
형식: [사실관계][주요 쟁점][리스크][즉시 조치][추가 확인사항]
톤: 객관적·중립적
분량: 항목별 3~5줄

사실관계:
- (여기에 입력)`
  },
  {
    id: "issue-extraction",
    title: "쟁점 도출 + 누락 질문",
    category: "사건 관리",
    description: "핵심 쟁점과 추가 확인 질문을 표로 정리합니다.",
    content: `아래 사건에서 법적/절차적 쟁점을 최대한 빠짐없이 뽑아줘.
그리고 각 쟁점별로 '추가로 확인해야 할 질문'을 3개씩 제시해줘.
형식: 표(쟁점 | 왜 중요한지 | 추가 질문)

사건:
- (입력)`
  },
  {
    id: "dept-reply",
    title: "부서 회신 메일 초안",
    category: "커뮤니케이션",
    description: "진료과·유관부서에 보낼 공식 회신 요청 메일을 작성합니다.",
    content: `다음 사안에 대해 진료과(또는 관련 부서)에 보낼 확인 요청 메일 초안을 작성해줘.
조건:
- 공손하지만 책임소재가 모호하지 않게
- 회신 기한 포함
- 필요한 첨부/증빙 목록 포함
- 문장 길이는 짧고 명확하게

배경:
- (입력)`
  },
  {
    id: "official-letter",
    title: "공문/내용증명 초안 구조",
    category: "대외 문서",
    description: "대외 발송 문서의 기본 구조를 격식 있게 구성합니다.",
    content: `다음 사실관계를 바탕으로 대외 발송용 공문(또는 내용증명) 초안 구조를 만들어줘.
형식:
1. 제목
2. 발송 취지
3. 사실관계 요약
4. 병원 입장
5. 요청사항/기한
6. 향후 조치 안내
문체: 법무 문서에 맞는 격식체
주의: 단정적 표현 과다 사용 금지, 사실과 의견 구분`
  },
  {
    id: "meeting-checklist",
    title: "회의 준비 체크리스트",
    category: "회의/보고",
    description: "법무·진료·원무 공동 회의 준비용 체크리스트를 만듭니다.",
    content: `이 안건으로 원내 회의(법무+진료+원무) 준비 체크리스트를 만들어줘.
카테고리:
- 필수 자료
- 참석자별 확인 포인트
- 회의에서 결정할 항목
- 회의 후 후속 액션(담당/기한)
형식: 체크박스 리스트`
  },
  {
    id: "five-line-report",
    title: "경영진 보고 5줄",
    category: "회의/보고",
    description: "의사결정에 필요한 핵심만 5줄로 요약합니다.",
    content: `아래 사안을 병원장/경영진 보고용으로 5줄 요약해줘.
구성:
1) 현재 상황
2) 핵심 리스크
3) 선택 가능한 대응안 2개
4) 각 대응안 장단점 한 줄
5) 권고안 한 줄
톤: 간결·판단지원형`
  },
  {
    id: "research-outline",
    title: "법령/판례 리서치 아웃라인",
    category: "리서치",
    description: "내부 검토 메모 작성을 위한 조사 틀을 제공합니다.",
    content: `다음 쟁점에 대해 리서치 아웃라인을 짜줘.
형식:
- 확인할 법령/고시/지침
- 키워드(검색어) 10개
- 유사 판례 확인 포인트
- 사실관계 매칭 체크리스트
목적: 내부 검토 메모 작성
쟁점:
- (입력)`
  },
  {
    id: "contract-review",
    title: "계약서 검토 포인트",
    category: "계약",
    description: "조항별 리스크와 수정 제안을 빠르게 확인합니다.",
    content: `아래 계약 조항을 법무지원팀 1차 검토용으로 분석해줘.
형식: [조항 요지][리스크][수정 제안 문구][협상 우선순위]
특히 확인:
- 손해배상/면책
- 해지 조항
- 준거법/관할
- 개인정보·보안
조항:
- (입력)`
  },
  {
    id: "dispute-scenario",
    title: "민원/분쟁 대응 시나리오",
    category: "사건 관리",
    description: "초기~종결 단계별 대응 전략을 설계합니다.",
    content: `다음 민원(또는 분쟁) 상황에 대한 대응 시나리오를 3단계로 설계해줘.
단계: 초기 대응(24시간) / 중기 대응(1주) / 종결 대응
각 단계별:
- 커뮤니케이션 문구
- 내부 의사결정 포인트
- 증빙 확보 항목`
  },
  {
    id: "rewrite-legal-tone",
    title: "문장 리라이팅 (법무 톤)",
    category: "커뮤니케이션",
    description: "감정 표현을 줄이고 공식 문서 문체로 다듬습니다.",
    content: `아래 문장을 법무지원팀 공식 문서 톤으로 다듬어줘.
요구사항:
- 감정적 표현 제거
- 사실/평가 분리
- 오해 소지 표현 축소
- 문장 20% 간결화
원문:
- (입력)`
  }
];

let selectedTemplateId = null;

function setMessage(text, type = "info") {
  messageEl.textContent = text;
  messageEl.classList.remove("info", "good", "warn");
  messageEl.classList.add(type);
}

function populateCategoryOptions() {
  const categories = [...new Set(templates.map((template) => template.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function getFilteredTemplates() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;

  return templates.filter((template) => {
    const matchCategory = selectedCategory === "all" || template.category === selectedCategory;
    const fullText = `${template.title} ${template.description} ${template.content}`.toLowerCase();
    const matchQuery = query === "" || fullText.includes(query);
    return matchCategory && matchQuery;
  });
}

function renderTemplateList() {
  const filteredTemplates = getFilteredTemplates();
  templateListEl.innerHTML = "";

  if (filteredTemplates.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-item";
    emptyItem.textContent = "검색 결과가 없습니다.";
    templateListEl.appendChild(emptyItem);
    return;
  }

  filteredTemplates.forEach((template) => {
    const li = document.createElement("li");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "template-btn";
    button.dataset.templateId = template.id;
    button.setAttribute("aria-pressed", String(template.id === selectedTemplateId));

    if (template.id === selectedTemplateId) {
      button.classList.add("active");
    }

    button.innerHTML = `
      <span class="template-title">${template.title}</span>
      <span class="template-meta">${template.category}</span>
    `;

    button.addEventListener("click", () => {
      selectedTemplateId = template.id;
      showTemplate(template.id);
      renderTemplateList();
    });

    li.appendChild(button);
    templateListEl.appendChild(li);
  });
}

function showTemplate(templateId) {
  const template = templates.find((item) => item.id === templateId);

  if (!template) {
    templateTitleEl.textContent = "템플릿을 선택하세요";
    templateDescriptionEl.textContent = "왼쪽 목록에서 원하는 템플릿을 누르면 내용을 확인할 수 있습니다.";
    templateContentEl.textContent = "선택된 템플릿이 없습니다.";
    copyBtn.disabled = true;
    return;
  }

  templateTitleEl.textContent = template.title;
  templateDescriptionEl.textContent = template.description;
  templateContentEl.textContent = template.content;
  copyBtn.disabled = false;
}

async function copySelectedTemplate() {
  const template = templates.find((item) => item.id === selectedTemplateId);

  if (!template) {
    setMessage("먼저 템플릿을 선택해주세요.", "warn");
    return;
  }

  try {
    await navigator.clipboard.writeText(template.content);
    setMessage(`✅ '${template.title}' 템플릿을 복사했어요.`, "good");
  } catch (error) {
    setMessage("복사에 실패했어요. 텍스트를 직접 드래그해 복사해주세요.", "warn");
  }
}

searchInput.addEventListener("input", () => {
  renderTemplateList();
});

categorySelect.addEventListener("change", () => {
  renderTemplateList();
});

copyBtn.addEventListener("click", () => {
  copySelectedTemplate();
});

populateCategoryOptions();
renderTemplateList();
setMessage("템플릿을 고른 뒤 복사 버튼을 눌러 사용하세요.");
