import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, MessageCircle, Music, ChevronDown, Sparkles, Gift, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import './App.css'

// Компонент для плавного появления при скролле
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Типы для сообщений чата
interface Message {
  id: number
  text: string
  sender: 'me' | 'her'
  time: string
}

// Сообщения чата (история знакомства)
const chatMessages: Message[] = [
  { id: 1, text: 'привет, Юлианна мой музыкальный вкус можно назвать раздачей кринжа, есть ли у нас в этом метч?', sender: 'me', time: '16:18' },
  { id: 2, text: 'Да! Топ пять песен профессора Лебединского', sender: 'her', time: '16:21' },
  { id: 3, text: 'только что впервые его послушал) интересный у него тембр ахаххахаах учат в школе по тексту дико рейвит', sender: 'me', time: '16:31' },
  { id: 4, text: 'Моя любимая я убью тебя лодочник Душераздирающая песня', sender: 'her', time: '16:32' },
  { id: 5, text: 'подставил лодочник добряка с гранатой...😢', sender: 'me', time: '16:52' },
  { id: 6, text: '...', sender: 'her', time: '' },
  { id: 7, text: '...', sender: 'me', time: '' },
  { id: 8, text: 'Пора разнообразить твою жизнь Прогулкой по самым знаменитым мостам Очень люблю ходить и рассматривать архитектуру, звучит душновато, но я обычно хожу так посмотреть полюбоваться одна', sender: 'her', time: '22:30' },
  { id: 9, text: 'это можем устроить) завтра вечером на черной речке, например. я так-то тоже люблю погулять и пофоткать красивые места и людей', sender: 'me', time: '22:37' },
]

// Фотографии с первого свидания (заглушки - замени на свои)
const datePhotos = [
  '/s1_1.jpg',
  '/s1_2.jpg',
  '/s1_3.jpg',
  '/s2_1.jpg',
  '/s3_1.jpg',
  '/s3_2.jpg',
  '/s3_3.jpg',
  '/s3_4.jpg',
  '/s3_5.jpg',
  '/s4_1.jpg',
  '/s4_2.jpg',
  '/s4_3.jpg',
]

// Генерация псевдослучайных чисел с затравкой для согласованности
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Конфигурация сердечек (генерируется при импорте) - падающие сверху вниз
const heartConfigs = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: seededRandom(i * 7) * 100,
  duration: 8 + seededRandom(i * 11) * 12,
  delay: seededRandom(i * 13) * 20,
  opacity: 0.3 + seededRandom(i * 17) * 0.5,
  size: 14 + seededRandom(i * 19) * 22,
  rotate: seededRandom(i * 23) * 40 - 20,
}))

// Анимированные сердечки - падающие сверху вниз как снег
function FloatingHearts() {
  return (
    <div className="floating-hearts">
      {heartConfigs.map((heart) => (
        <motion.div
          key={heart.id}
          className="floating-heart"
          initial={{ 
            x: 0,
            y: '-50px',
            opacity: 0,
            rotate: heart.rotate
          }}
          animate={{ 
            y: '110vh',
            opacity: [0, heart.opacity, heart.opacity, 0],
            rotate: [heart.rotate, heart.rotate + 20, heart.rotate - 20, heart.rotate]
          }}
          transition={{ 
            duration: heart.duration, 
            repeat: Infinity,
            delay: heart.delay,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            left: `${heart.left}%`,
            willChange: 'transform, opacity'
          }}
        >
          <Heart 
            size={heart.size} 
            fill="#ff69b4" 
            color="#ff69b4"
            style={{ opacity: heart.opacity }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Секция 1: Главное поздравление
function HeroSection({ onNext }: { onNext: () => void }) {
  const confettiFired = useRef(false)

  useEffect(() => {
    if (confettiFired.current) return
    confettiFired.current = true

    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffb6c1', '#ffc0cb', '#ff69b4', '#ff1493']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffb6c1', '#ffc0cb', '#ff69b4', '#ff1493']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  return (
    <section className="section hero-section">
      <div className="hero-content">
        <FadeIn>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="hero-heart"
          >
            <Heart size={80} fill="#ff1493" color="#ff1493" />
          </motion.div>
        </FadeIn>
          
        <FadeIn delay={0.1}>
          <h1 className="hero-title">С Днём Рождения!</h1>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <p className="hero-subtitle">Моя любимая Юлианночка ❤️</p>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <p className="hero-text">
            Сегодня твой день — и я хочу, чтобы он был самым особенным!
            Ты делаешь мою жизнь ярче каждый день.
          </p>
        </FadeIn>
          
        <FadeIn delay={0.5}>
          <motion.button
            className="scroll-hint"
            onClick={onNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Листай вниз</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.button>
        </FadeIn>
      </div>
    </section>
  )
}

// Секция 2: Чат знакомства
function ChatSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.section 
      className="section chat-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="section-header"
      >
        <MessageCircle size={28} color="#ff69b4" />
        <h2>Как всё началось...</h2>
      </motion.div>
      
      <motion.div 
        className="chat-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ scale: 0.8, opacity: 0, x: msg.sender === 'me' ? 50 : -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 280, 
                damping: 22, 
                delay: 0.7 + index * 0.2 
              }}
              className={`chat-message ${msg.sender}`}
            >
              <div className="message-bubble">
                {msg.text}
                <span className="message-time">{msg.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  )
}

// Секция 3: Фотографии с горизонтальным перелистыванием
function PhotosSection() {
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const nextPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev + 1) % datePhotos.length)
  }, [])

  const prevPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev - 1 + datePhotos.length) % datePhotos.length)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextPhoto()
      } else {
        prevPhoto()
      }
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  return (
    <motion.section 
      className="section photos-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="section-header"
      >
        <Camera size={28} color="#ff69b4" />
        <h2>Наше первое свидание</h2>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="photos-carousel-wrapper"
      >
        <div 
          className="photos-carousel"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.button
            className="carousel-btn carousel-btn-left" 
            onClick={prevPhoto}
            aria-label="Предыдущее фото"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={28} />
          </motion.button>
          
          <div className="carousel-track">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhoto}
                src={datePhotos[currentPhoto]}
                alt={`Фото ${currentPhoto + 1}`}
                className="carousel-photo"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </AnimatePresence>
          </div>
          
          <motion.button
            className="carousel-btn carousel-btn-right" 
            onClick={nextPhoto}
            aria-label="Следующее фото"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={28} />
          </motion.button>
        </div>
        
        <div className="carousel-dots">
          {datePhotos.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === currentPhoto ? 'active' : ''}`}
              onClick={() => setCurrentPhoto(i)}
              aria-label={`Фото ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
      
      <motion.p
        className="photo-caption"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        Лучший день в моей жизни ❤️
      </motion.p>
    </motion.section>
  )
}

// Секция 4: Видео подводка
function VideoSection() {
  return (
    <motion.section 
      className="section video-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="section-header"
      >
        <Music size={28} color="#ff69b4" />
        <h2>Мой подарок для тебя</h2>
      </motion.div>
      
      <motion.div
        className="video-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="video-preview">
          <motion.div
            className="guitar-icon"
            animate={{ 
              rotate: [-5, 5, -5],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Music size={60} color="#ff1493" />
          </motion.div>
          
          <p className="video-text">
            Я выучил песню специально для тебя...
          </p>
          
          <motion.button
            className="play-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={20} />
            <span>Смотреть видео</span>
          </motion.button>
        </div>
        
        <div className="hearts-decoration">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity
              }}
              style={{
                left: `${10 + i * 8}%`,
                position: 'absolute'
              }}
            >
              <Heart size={16} fill="#ff69b4" color="#ff69b4" />
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div
        className="final-message"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <Heart size={32} fill="#ff1493" color="#ff1493" />
        <p>Я люблю тебя больше всего на свете!</p>
        <p>С наилучшими пожеланиями,</p>
        <p className="signature">Твой единственный ❤️</p>
      </motion.div>
    </motion.section>
  )
}

// Тип для Web NFC API
interface NDEFReader {
  scan(): Promise<void>
  onreading: ((event: Event) => void) | null
}

// NFC Prompt компонент
function NFCPrompt({ onComplete }: { onComplete: () => void }) {
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    // Проверяем поддержку Web NFC API
    if ('NDEFReader' in window) {
      const ndef = new (window as unknown as { NDEFReader: new () => NDEFReader }).NDEFReader()
      
      ndef.scan().then(() => {
        ndef.onreading = () => {
          setScanned(true)
          setTimeout(onComplete, 1500)
        }
      }).catch(() => {
        // NFC не доступен или отклонён
        setTimeout(onComplete, 1000)
      })
    } else {
      // NFC не поддерживается - сразу показываем поздравление
      setTimeout(onComplete, 500)
    }
  }, [onComplete])

  return (
    <motion.div
      className="nfc-prompt"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Gift size={80} color="#ff1493" />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {scanned ? 'Отлично! 🎉' : 'Поднеси телефон к NFC метке'}
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {scanned 
          ? 'Загрузка твоего сюрприза...' 
          : 'Приготовься к незабываемому моменту ❤️'}
      </motion.p>
      
      {!scanned && (
        <motion.div
          className="nfc-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="nfc-ring" />
          <div className="nfc-ring delay-1" />
          <div className="nfc-ring delay-2" />
        </motion.div>
      )}
    </motion.div>
  )
}

// Главное приложение
export default function App() {
  const [currentSection, setCurrentSection] = useState(0)
  const [started, setStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Отслеживаем текущую секцию по скроллу (только для индикатора)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const newSection = Math.round(scrollPosition / windowHeight)
      setCurrentSection(Math.min(newSection, 3))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = useCallback((section: number) => {
    window.scrollTo({
      top: section * window.innerHeight,
      behavior: 'smooth'
    })
  }, [])

  if (!started) {
    return (
      <AnimatePresence>
        <NFCPrompt onComplete={() => setStarted(true)} />
      </AnimatePresence>
    )
  }

  return (
    <div className="app" ref={containerRef}>
      {/* Фон на всех секциях */}
      <FloatingHearts />
      
      <HeroSection onNext={() => scrollToSection(1)} />
      <ChatSection />
      <PhotosSection />
      <VideoSection />
      
      {/* Индикатор прогресса */}
      <div className="progress-indicator">
        {[0, 1, 2, 3].map((section) => (
          <button
            key={section}
            className={`progress-dot ${currentSection >= section ? 'active' : ''}`}
            onClick={() => scrollToSection(section)}
            aria-label={`Перейти к секции ${section + 1}`}
          >
            {section === 0 && <Heart size={14} />}
            {section === 1 && <MessageCircle size={14} />}
            {section === 2 && <Camera size={14} />}
            {section === 3 && <Music size={14} />}
          </button>
        ))}
      </div>
    </div>
  )
}