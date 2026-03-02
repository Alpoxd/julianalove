import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, MessageCircle, Music, ChevronDown, Sparkles, Gift, Camera } from 'lucide-react'
import './App.css'

// Типы для сообщений чата
interface Message {
  id: number
  text: string
  sender: 'me' | 'her'
  time: string
}

// Сообщения чата (история знакомства)
const chatMessages: Message[] = [
  { id: 1, text: 'Привет! Я увидел тебя в парке и не смог пройти мимо 😊', sender: 'me', time: '14:32' },
  { id: 2, text: 'Ого, это было смело! А что понравилось?', sender: 'her', time: '14:35' },
  { id: 3, text: 'У тебя такие красивые глаза, не смог забыть', sender: 'me', time: '14:36' },
  { id: 4, text: 'Ты такой романтик 😳 А давай встретимся?', sender: 'her', time: '14:38' },
  { id: 5, text: 'Я бы очень хотел! Как насчёт субботы в том же парке?', sender: 'me', time: '14:40' },
  { id: 6, text: 'Договорились! Жду тебя в 15:00', sender: 'her', time: '14:42' },
]

// Фотографии с первого свидания (заглушки - замени на свои)
const datePhotos = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
]

// Генерация псевдослучайных чисел с затравкой для согласованности
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Конфигурация сердечек (генерируется при импорте)
const heartConfigs = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: seededRandom(i * 7) * 100,
  startRotate: seededRandom(i * 13) * 360,
  endRotate: seededRandom(i * 17) * 360 + 360,
  duration: 8 + seededRandom(i * 19) * 8,
  delay: seededRandom(i * 23) * 10,
  opacity: 0.3 + seededRandom(i * 29) * 0.5,
  fontSize: 16 + seededRandom(i * 31) * 24
}))

// Конфигурация фотографий
const photoConfigs = datePhotos.map((_, i) => ({
  id: i,
  initialRotate: -5 + seededRandom(i * 37) * 10
}))

// Анимированные сердечки на фоне
function FloatingHearts() {
  return (
    <div className="floating-hearts">
      {heartConfigs.map((heart) => (
        <motion.div
          key={heart.id}
          className="floating-heart"
          initial={{ 
            x: `${heart.x}%`, 
            y: '110%',
            scale: 0,
            rotate: heart.startRotate
          }}
          animate={{ 
            y: '-10%',
            scale: [0, 1, 1, 0],
            rotate: heart.endRotate
          }}
          transition={{ 
            duration: heart.duration, 
            repeat: Infinity,
            delay: heart.delay,
            ease: 'linear'
          }}
          style={{
            left: `${heart.x}%`,
            opacity: heart.opacity,
            fontSize: `${heart.fontSize}px`
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  )
}

// Секция 1: Главное поздравление
function HeroSection({ onNext }: { onNext: () => void }) {
  useEffect(() => {
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
      <FloatingHearts />
      
      <motion.div
        className="hero-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
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
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hero-title"
        >
          С Днём Рождения!
        </motion.h1>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hero-subtitle"
        >
          Моя любимая Юлианночка ❤️
        </motion.p>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="hero-text"
        >
          Сегодня твой день — и я хочу, чтобы он был самым особенным!
          Ты делаешь мою жизнь ярче каждый день.
        </motion.p>
        
        <motion.button
          className="scroll-hint"
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
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
      </motion.div>
    </section>
  )
}

// Секция 2: Чат знакомства
function ChatSection({ visible }: { visible: boolean }) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible) {
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < chatMessages.length) {
          setDisplayedMessages(chatMessages.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, 1500)
      
      return () => clearInterval(interval)
    }
  }, [visible])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedMessages])

  if (!visible) return null

  return (
    <section className="section chat-section">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section-header"
      >
        <MessageCircle size={28} color="#ff69b4" />
        <h2>Как всё началось...</h2>
      </motion.div>
      
      <div className="chat-container">
        <div className="chat-messages">
          {displayedMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`chat-message ${msg.sender}`}
            >
              <div className="message-bubble">
                {msg.text}
                <span className="message-time">{msg.time}</span>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </section>
  )
}

// Секция 3: Фотографии
function PhotosSection({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <section className="section photos-section">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section-header"
      >
        <Camera size={28} color="#ff69b4" />
        <h2>Наше первое свидание</h2>
      </motion.div>
      
      <div className="photos-grid">
        {datePhotos.map((photo, i) => (
          <motion.div
            key={photoConfigs[i].id}
            className="photo-card"
            initial={{ scale: 0.8, opacity: 0, rotate: photoConfigs[i].initialRotate }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2 + i * 0.2, type: 'spring' }}
            whileHover={{ scale: 1.05, rotate: 0 }}
          >
            <img src={photo} alt={`Фото ${i + 1}`} />
            <div className="photo-frame" />
          </motion.div>
        ))}
      </div>
      
      <motion.p 
        className="photo-caption"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Лучший день в моей жизни ❤️
      </motion.p>
    </section>
  )
}

// Секция 4: Видео подводка
function VideoSection({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <section className="section video-section">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
            <motion.span
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
              ❤️
            </motion.span>
          ))}
        </div>
      </motion.div>
      
      <motion.div
        className="final-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Heart size={32} fill="#ff1493" color="#ff1493" />
        <p>Я люблю тебя больше всего на свете!</p>
        <p>С наилучшими пожеланиями,</p>
        <p className="signature">Твой единственный ❤️</p>
      </motion.div>
    </section>
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

  // Отслеживаем текущую секцию по скроллу
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
      <HeroSection onNext={() => scrollToSection(1)} />
      <ChatSection visible={currentSection >= 1} />
      <PhotosSection visible={currentSection >= 2} />
      <VideoSection visible={currentSection >= 3} />
      
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