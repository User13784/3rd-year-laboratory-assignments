import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nameEn: '',
    nameRu: '',
    price: 0,
    category: '',
    inStock: true,
    descriptionEn: '',
    descriptionRu: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nameEn: product.name?.en || '',
        nameRu: product.name?.ru || '',
        price: product.price || 0,
        category: product.category || 'sofa',
        inStock: product.inStock !== undefined ? product.inStock : true,
        descriptionEn: product.description?.en || '',
        descriptionRu: product.description?.ru || ''
      });
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
    onSave({
      ...product,
      name: { en: formData.nameEn, ru: formData.nameRu },
      price: parseFloat(formData.price),
      category: formData.category,
      inStock: formData.inStock,
      description: { en: formData.descriptionEn, ru: formData.descriptionRu }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✏️ Редактировать товар">
      <form className="edit-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название (EN)</label>
          <input
            type="text"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Название (RU)</label>
          <input
            type="text"
            name="nameRu"
            value={formData.nameRu}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Цена (£)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Категория</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="sofa">Диваны</option>
            <option value="living">Гостиная</option>
            <option value="kitchen">Кухня</option>
            <option value="bedroom">Спальня</option>
            <option value="bathroom">Ванная</option>
            <option value="decor">Декор</option>
            <option value="ceramics">Керамика</option>
          </select>
        </div>

        <div className="form-group">
          <label>Описание (EN)</label>
          <textarea
            name="descriptionEn"
            value={formData.descriptionEn}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Описание (RU)</label>
          <textarea
            name="descriptionRu"
            value={formData.descriptionRu}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            {' '}В наличии
          </label>
        </div>

        <div className="modal-buttons">
          <button type="submit" className="submit-btn">💾 Сохранить</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProductModal;