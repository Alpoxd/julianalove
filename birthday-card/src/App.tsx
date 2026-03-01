import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Pause, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// ============================================
// 📸 ФОТОГРАФИИ: положи в папку public/ 
//    и используй так: /my-photo.jpg
//    Пример: '/photo1.jpg', '/photo2.jpg'
// ============================================
const PHOTOS = [
  '/photo1.jpg',  // Замени на свои фото
  '/photo2.jpg',
  '/photo3.jpg',
];

// ============================================
// 🎵 ГОЛОСОВОЕ: положи в public/ 
//    и укажи название файла
// ============================================
const VOICE_MESSAGE = '/voice.mp3';  // Замени на свой файл

// Цвета
const COLORS = {
  gradient: 'linear-gradient(135deg, #fff0f3 0%, #ffe4e9 50%, #fff0f5 100%)',
  card: 'rgba(255, 255, 255, 0.85)',
  primary: '#ff6b9d',
  primaryLight: '#ffaec9',
  primaryDark: '#e84a7f',
  text: '#4a4a4a',
  textLight: '#7a7a7a',
  accent: '#ff8fab',
};

// Плавающие сердечки для фона
const FloatingHearts: React.FC = () => {
  const hearts = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 8 + 12,
    })), []
  );

  return (
    <div style={styles.floatingHearts}>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          style={{
            ...styles.floatingHeart,
            left: `${heart.left}%`,
            width: heart.size,
            height: heart.size,
          }}
          initial={{ y: '110vh', opacity: 0, scale: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0.8],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Heart fill={COLORS.primary} color={COLORS.primary} />
        </motion.div>
      ))}
    </div>
  );
};

// Пузырьки на фоне
const Bubbles: React.FC = () => {
  const bubbles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 40 + 20,
      duration: Math.random() * 10 + 15,
    })), []
  );

  return (
    <div style={styles.bubbles}>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          style={{
            ...styles.bubble,
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
          }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ 
            y: '-20vh',
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Запуск конфетти при загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [COLORS.primary, COLORS.primaryLight, COLORS.accent, '#ffd700']
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Показ контента с задержкой
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextPhoto = () => setCurrentPhoto((prev) => (prev + 1) % PHOTOS.length);
  const prevPhoto = () => setCurrentPhoto((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);

  return (
    <div style={styles.container}>
      {/* Анимированный фон */}
      <FloatingHearts />
      <Bubbles />
      
      {/* Слой с градиентом поверх фона */}
      <div style={styles.gradientOverlay} />

      {/* Аудио */}
      <audio ref={audioRef} src={VOICE_MESSAGE} preload="metadata" />

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={styles.card}
          >
            {/* Header с именем */}
            <motion.header 
              style={styles.header}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: 'easeInOut'
                }}
                style={styles.heartIcon}
              >
                <Heart fill={COLORS.primary} color={COLORS.primary} size={36} />
              </motion.div>
              
              <motion.h1 
                style={styles.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                С Днём Рождения!
              </motion.h1>
              
              <motion.p
                style={styles.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Юлианночка ❤️
              </motion.p>
            </motion.header>

            {/* Фото слайдер */}
            <motion.div 
              style={styles.sliderContainer}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhoto}
                  src={PHOTOS[currentPhoto]}
                  alt={`Фото ${currentPhoto + 1}`}
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -80, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={styles.image}
                />
              </AnimatePresence>
              
              {/* Навигация */}
              <motion.button
                onClick={prevPhoto}
                style={{ ...styles.navBtn, left: 12 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={22} color={COLORS.primary} />
              </motion.button>
              
              <motion.button
                onClick={nextPhoto}
                style={{ ...styles.navBtn, right: 12 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={22} color={COLORS.primary} />
              </motion.button>

              {/* Индикаторы */}
              <div style={styles.dots}>
                {PHOTOS.map((_, idx) => (
                  <motion.div
                    key={idx}
                    style={{
                      ...styles.dot,
                      backgroundColor: idx === currentPhoto ? COLORS.primary : 'rgba(255,107,157,0.3)',
                    }}
                    animate={{ scale: idx === currentPhoto ? 1.2 : 1 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Основной контент */}
            <motion.div 
              style={styles.content}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div style={styles.messageBox}>
                <Sparkles size={18} color={COLORS.primary} />
                <p style={styles.message}>
                  Ты — самое прекрасное, что случилось в моей жизни. 
                  Каждый день с тобой — это подарок. Я так счастлив, что ты есть! 
                  Желаю тебе исполнения всех желаний, ярких эмоций и бесконечной любви. 
                  Ты заслуживаешь самого лучшего! ✨
                </p>
                <Sparkles size={18} color={COLORS.primary} />
              </div>

              {/* Кнопка аудио */}
              <motion.button
                onClick={toggleAudio}
                style={styles.audioButton}
                whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(255,107,157,0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                {isPlaying ? (
                  <>
                    <Pause size={20} />
                    <span>Пауза</span>
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    <span>Послушать голосовое</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.footer 
              style={styles.footer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span style={styles.footerText}>Люблю тебя бесконечно ❤️</span>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'env(safe-area-inset-top, 20px) 16px env(safe-area-inset-bottom, 20px) 16px',
  },
  gradientOverlay: {
    position: 'absolute',
    inset: 0,
    background: COLORS.gradient,
    zIndex: 0,
  },
  floatingHearts: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 1,
  },
  floatingHeart: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbles: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 1,
  },
  bubble: {
    position: 'absolute',
    bottom: 0,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,174,201,0.3))',
    backdropFilter: 'blur(2px)',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '360px',
    background: COLORS.card,
    borderRadius: '32px',
    boxShadow: '0 25px 80px rgba(255,107,157,0.2), 0 10px 40px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  },
  header: {
    padding: '28px 20px 16px',
    textAlign: 'center',
  },
  heartIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: COLORS.text,
    margin: 0,
    letterSpacing: '-0.5px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  name: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.primary,
    margin: '8px 0 0',
  },
  sliderContainer: {
    position: 'relative',
    height: '320px',
    margin: '0 16px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 15px 40px rgba(255,107,157,0.2)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: COLORS.primaryLight,
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    zIndex: 5,
  },
  dots: {
    position: 'absolute',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '6px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  content: {
    padding: '20px',
  },
  messageBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(255,174,201,0.2) 0%, rgba(255,143,171,0.15) 100%)',
    borderRadius: '20px',
    marginBottom: '16px',
  },
  message: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: COLORS.text,
    margin: 0,
    flex: 1,
    textAlign: 'center',
  },
  audioButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '16px 20px',
    borderRadius: '18px',
    border: 'none',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 10px 30px rgba(255,107,157,0.35)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  footer: {
    padding: '16px 20px 24px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '15px',
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: '0.5px',
  },
};

export default App;