# ابزارهای ریاضیات گسسته - Discrete Mathematics Tools

یک اپلیکیشن وب حرفه‌ای برای کار با مفاهیم مختلف ریاضیات گسسته شامل نظریه گراف، روابط، و عملیات بولی.

## ✨ ویژگی‌ها

### 📊 عملیات روی روابط

- **تبدیل رابطه به گراف**: تبدیل ماتریس مجاورت به گراف جهت‌دار
- **عملیات بولی**: جمع بولی (OR) و ضرب عنصر به عنصر (AND)
- **ضرب بولی ماتریس‌ها**: ضرب بولی دو ماتریس
- **توان رابطه**: محاسبه R^n و بستار تعدی
- **خواص رابطه**: بررسی خواص بازتابی، تقارنی، تعدی و غیره
- **بستارهای رابطه**: محاسبه بستار بازتابی، تقارنی و تعدی
- **ترکیب روابط**: محاسبه RoS

### 📈 عملیات روی گراف‌ها

- **رسم گراف**: نمایش گرافیکی از ماتریس مجاورت
- **درجه رئوس**: محاسبه درجه ورودی و خروجی رئوس
- **ماتریس مکمل**: محاسبه گراف مکمل
- **بررسی زیرگراف**: تشخیص زیرگراف و زیرگراف القایی
- **بررسی همبندی**: تشخیص همبندی قوی و ضعیف
- **طول مسیر**: محاسبه طول مسیر با ماتریس وزن
- **مسیر اویلری**: یافتن مسیر اویلری در گراف
- **الگوریتم دایکسترا**: یافتن کوتاه‌ترین مسیر

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- Python 3.8+
- Node.js 16+
- npm یا yarn

### نصب خودکار

```bash
# اجرای اسکریپت راه‌اندازی
./start.sh
```

### نصب دستی

#### Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # در Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## 🖥️ استفاده

1. Backend را روی پورت 5000 اجرا کنید
2. Frontend را روی پورت 3000 اجرا کنید
3. مرورگر را باز کرده و به آدرس <http://localhost:3000> بروید
4. از تب‌های مختلف برای دسترسی به ابزارها استفاده کنید

## 🏗️ ساختار پروژه

```tree
DiscreteMathematics/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── styles/        # CSS styles
│   └── package.json
├── backend/               # Flask API
│   ├── app.py            # Main API server
│   └── requirements.txt
└── projects/             # Original Python scripts
    ├── 2_relation_to_graph/
    ├── 3_boolean_and_or/
    └── ...
```

## 🛠️ تکنولوژی‌های استفاده شده

### Frontend

- **React 18**: فریمورک UI
- **Material-UI**: کامپوننت‌های UI
- **Vite**: Build tool
- **Axios**: HTTP client
- **React Toastify**: نمایش پیام‌ها

### Backend

- **Flask**: وب فریمورک Python
- **NumPy**: محاسبات ماتریسی
- **NetworkX**: عملیات گراف
- **Matplotlib**: رسم گراف

## 📝 API Endpoints

| Endpoint | Method | توضیحات |
|----------|--------|---------|
| `/api/relation-to-graph` | POST | تبدیل ماتریس به گراف |
| `/api/boolean-operations` | POST | عملیات بولی |
| `/api/boolean-multiplication` | POST | ضرب بولی |
| `/api/relation-power` | POST | توان رابطه |
| `/api/relation-properties` | POST | خواص رابطه |
| `/api/relation-closures` | POST | بستارهای رابطه |
| `/api/relation-composition` | POST | ترکیب روابط |
| `/api/visualize-graph` | POST | رسم گراف |
| `/api/vertex-degree` | POST | درجه رئوس |
| `/api/complement-matrix` | POST | ماتریس مکمل |
| `/api/check-subgraph` | POST | بررسی زیرگراف |
| `/api/check-connectivity` | POST | بررسی همبندی |
| `/api/calculate-path-length` | POST | طول مسیر |
| `/api/find-eulerian-path` | POST | مسیر اویلری |
| `/api/dijkstra-shortest-path` | POST | الگوریتم دایکسترا |

## 🎨 ویژگی‌های UI

- **Dark Theme**: تم تاریک مدرن و زیبا
- **Responsive Design**: سازگار با تمام دستگاه‌ها
- **RTL Support**: پشتیبانی کامل از زبان فارسی
- **Interactive Matrices**: ورودی ماتریس تعاملی
- **Real-time Validation**: اعتبارسنجی لحظه‌ای
- **Visual Feedback**: بازخورد بصری برای عملیات

## 🤝 مشارکت

برای مشارکت در توسعه:

1. Fork کنید
2. Branch جدید ایجاد کنید
3. تغییرات را Commit کنید
4. Pull Request ارسال کنید

---

ساخته شده با ❤️ برای دانشجویان ریاضیات گسسته
