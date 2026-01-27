
import React, { useState } from 'react';
import { Button, Input } from './ui';

export function FeedbackModal({ onClose, onSubmit, defaultRating = 0 }) {
  const [rating, setRating] = useState(defaultRating);
  const [tags, setTags] = useState([]);
  const [review, setReview] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = () => {
    if (!review.trim()) {
      setShowWarning(true);
      return;
    }
    onSubmit({ rating, tags, review });
    onClose();
  };

  return (
    <div className="feedback-modal">
      <h3>Оставьте отзыв</h3>
      <div>
        <label>Звезды</label>
        <Input type="number" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
      </div>
      <div>
        <label>Теги</label>
        <Input value={tags} onChange={(e) => setTags(e.target.value.split(','))} />
      </div>
      <div>
        <label>Отзыв</label>
        <Input value={review} onChange={(e) => setReview(e.target.value)} />
      </div>
      {showWarning && <div>Пожалуйста, оставьте хотя бы текстовый отзыв!</div>}
      <Button onClick={handleSubmit}>Сохранить отзыв</Button>
      <Button onClick={onClose}>Закрыть</Button>
    </div>
  );
}
