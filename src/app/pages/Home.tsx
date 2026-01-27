
import React, { useState, useEffect } from 'react';
import { FeedbackModal } from './components/FeedbackModal';

export function Home() {
  const [showModal, setShowModal] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);
  const [showFeedbackReminder, setShowFeedbackReminder] = useState(false);

  const handleSubmitReview = (review) => {
    // Mock: Save review to localStorage
    localStorage.setItem('userReview', JSON.stringify(review));
    setReviewSaved(true);
    setShowModal(false);
  };

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    // Mock: Check if the review is already saved
    const savedReview = localStorage.getItem('userReview');
    if (!savedReview) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      setShowFeedbackReminder(true);
    }
  }, [showModal]);

  return (
    <div>
      {showModal && <FeedbackModal onClose={handleCloseModal} onSubmit={handleSubmitReview} />}
      {showFeedbackReminder && !reviewSaved && (
        <div>
          <p>Оставьте отзыв, чтобы продолжить проверку контрагента</p>
        </div>
      )}
      {/* Other UI components go here */}
    </div>
  );
}
