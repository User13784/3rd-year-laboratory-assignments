import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Modal from '../common/Modal';

function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nameEn: '',
    nameRu: '',
    price: 0,
    category: 'sofa',
    inStock: true,
    descriptionEn: '',
    descriptionRu: '',
    image: ''
  });

  const [validated, setValidated] = useState(false);

  // Заполняем форму при открытии
  useEffect(() => {
    if (product) {
      setFormData({
        nameEn: product.name?.en || '',
        nameRu: product.name?.ru || '',
        price: product.price || 0,
        category: product.category || 'sofa',
        inStock: product.inStock !== undefined ? product.inStock : true,
        descriptionEn: product.description?.en || '',
        descriptionRu: product.description?.ru || '',
        image: product.image || ''
      });
      setValidated(false);
    }
  }, [product]);

  if (!product) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    onSave({
      ...product,
      name: { en: formData.nameEn, ru: formData.nameRu },
      price: parseFloat(formData.price),
      category: formData.category,
      inStock: formData.inStock,
      description: { en: formData.descriptionEn, ru: formData.descriptionRu },
      image: formData.image
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✏️ Редактировать товар"
      size="lg"
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Название (EN) *</Form.Label>
              <Form.Control
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                required
                placeholder="Luxury Sofa"
              />
              <Form.Control.Feedback type="invalid">
                Введите название на английском
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Название (RU) *</Form.Label>
              <Form.Control
                type="text"
                name="nameRu"
                value={formData.nameRu}
                onChange={handleChange}
                required
                placeholder="Роскошный диван"
              />
              <Form.Control.Feedback type="invalid">
                Введите название на русском
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Цена (£) *</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
              <Form.Control.Feedback type="invalid">
                Введите корректную цену
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Категория *</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
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
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Наличие</Form.Label>
              <Form.Check
                type="switch"
                id="inStock-switch"
                name="inStock"
                label={formData.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                checked={formData.inStock}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>URL изображения</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="/assets/images/c1.jpg"
          />
        </Form.Group>

        {/* Превью изображения */}
        {formData.image && (
          <div className="text-center mb-3">
            <img
              src={formData.image}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxHeight: '150px', objectFit: 'contain' }}
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

        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" type="submit">
            💾 Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default EditProductModal;