import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { createProduct } from '../../features/products/productsSlice';
import { useLanguage } from '../../context/LanguageContext';

function AddProductModal({ isOpen, onClose }) {
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    nameEn: '',
    nameRu: '',
    price: '',
    category: 'sofa',
    image: '/assets/images/c1.jpg',
    descriptionEn: '',
    descriptionRu: '',
    inStock: true,
    rating: 5
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // ===== ВАЛИДАЦИЯ =====
  const validate = () => {
    const errs = {};
    if (!formData.nameEn.trim()) errs.nameEn = 'Введите название (EN)';
    if (!formData.nameRu.trim()) errs.nameRu = 'Введите название (RU)';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errs.price = 'Цена должна быть больше 0';
    }
    if (!formData.image.trim()) errs.image = 'Укажите URL изображения';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===== ИЗМЕНЕНИЕ ПОЛЕЙ =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ===== ОТПРАВКА =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const newProduct = {
        id: Date.now().toString(),
        name: { en: formData.nameEn, ru: formData.nameRu },
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        description: { en: formData.descriptionEn, ru: formData.descriptionRu },
        inStock: formData.inStock,
        rating: parseFloat(formData.rating) || 5,
        isFavorite: false
      };

      await dispatch(createProduct(newProduct)).unwrap();
      setSuccess(true);

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Ошибка создания товара');
    }
  };

  // ===== СБРОС =====
  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameRu: '',
      price: '',
      category: 'sofa',
      image: '/assets/images/c1.jpg',
      descriptionEn: '',
      descriptionRu: '',
      inStock: true,
      rating: 5
    });
    setErrors({});
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>➕ Добавить товар</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          {success && (
            <Alert variant="success">✅ Товар успешно добавлен!</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Название (EN) *</Form.Label>
            <Form.Control
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              isInvalid={!!errors.nameEn}
              placeholder="Luxury Sofa"
            />
            <Form.Control.Feedback type="invalid">{errors.nameEn}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Название (RU) *</Form.Label>
            <Form.Control
              type="text"
              name="nameRu"
              value={formData.nameRu}
              onChange={handleChange}
              isInvalid={!!errors.nameRu}
              placeholder="Роскошный диван"
            />
            <Form.Control.Feedback type="invalid">{errors.nameRu}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Цена (£) *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              isInvalid={!!errors.price}
              min="0"
              step="0.01"
              placeholder="899.00"
            />
            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Категория *</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="sofa">Диваны</option>
              <option value="living">Гостиная</option>
              <option value="kitchen">Кухня</option>
              <option value="bedroom">Спальня</option>
              <option value="bathroom">Ванная</option>
              <option value="decor">Декор</option>
              <option value="ceramics">Керамика</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL изображения *</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              isInvalid={!!errors.image}
              placeholder="/assets/images/c1.jpg"
            />
            <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
          </Form.Group>

          {formData.image && (
            <div className="text-center mb-3">
              <img
                src={formData.image}
                alt="Preview"
                className="img-thumbnail"
                style={{ maxHeight: '150px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Описание (EN)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              placeholder="Premium luxury sofa..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Описание (RU)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descriptionRu"
              value={formData.descriptionRu}
              onChange={handleChange}
              placeholder="Роскошный диван..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="inStock-switch"
              name="inStock"
              label={formData.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
              checked={formData.inStock}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <Button variant="primary" type="submit">💾 Добавить</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddProductModal;