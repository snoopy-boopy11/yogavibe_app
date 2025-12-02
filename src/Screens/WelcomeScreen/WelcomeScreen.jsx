import React from 'react';
import './WelcomeScreen.css'; // Подключаем файл со стилями
import { useNavigate } from 'react-router';
import eye from './eye.svg'
import talk from './talk.svg'
import comm from './comm.svg'

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleFindMentor = () => {
    navigate('/login'); // Переход на страницу входа
  };

  return (
    <div className="welcome-screen">
      {/* Основной контент */}
      <div className="content">
        
        <div className="main-text">
          <h1>Йога — это не только асаны<br />Найдите того, кто покажет путь</h1>
          
          <p className="description">
            Соединяем искателей с опытными наставниками для персонального роста
          </p>
          
          <button className="cta-button" onClick={handleFindMentor}>НАЙТИ МЕНТОРА</button>
        </div>
      </div>

      {/* Футер с блоком "Как это работает" */}
      <footer className="footer">
        <div className="how-it-works">
          <h2>КАК ЭТО РАБОТАЕТ</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-header">
                 <img src={eye} alt="Выбор ментора" className="step-icon"/>
                 <h3>ВЫБЕРИ МЕНТОРА</h3>
              </div>

              <p>
                Мы тщательно отбираем каждого наставника в нашем сообществе. 
                Здесь вы можете найти специалистов с разным опытом и подходом. 
                Вы можете быть уверены в качестве и профессионализме будущего наставника. 
                Просто откройте профили преподавателей, изучите их методику — и выберите того, 
                кому захочется доверить свое развитие.
              </p>
            </div>
            
            <div className="step">
              <div className="step-header">
                 <img src={talk} alt="Выбор даты и времени" className="step-icon"/>
                 <h3>ВЫБЕРИ ДАТУ И ВРЕМЯ</h3>
              </div>

              <p>
                Как только вы определитесь с наставником, вам нужно выбрать день и время для сессии. 
                Просто выберите удобный слот в расписании наставника. После подтверждения вы получите 
                все детали в разделе «Мои сессии».
              </p>
            </div>
            
            <div className="step">
              <div className="step-header">
                <img src={comm} alt="Дело за нами" className="step-icon"/>
                <h3>ДЕЛО ЗА НАМИ</h3>
              </div>

              <p>
                Мы отправим вам напоминание о сессии. Остается только подготовиться и настроиться 
                на продуктивную работу. Мы создаем условия, где каждый может найти необходимую 
                поддержку и раскрыть свой потенциал. Осталось только сделать первый шаг навстречу изменениям.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;