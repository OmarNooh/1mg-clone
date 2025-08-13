import React, { useState, useEffect } from 'react';
import { IoCloseSharp, IoChevronBack, IoChevronForward, IoWarning, IoHelpCircle } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ItemWizard.module.css';

const ItemWizard = ({ itemId = null, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillItem = location?.state?.item || null;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Product Identity
    itemType: 'Physical good',
    name: '',
    optionalSellingName: '',
    brand: '',
    
    // Description
    description: '',
    bulletPoints: [''],
    images: [],
    
    // Product Details
    category: '',
    location: 'All locations',
    ageRestriction: 'None',
    expiryDate: '',
    manufacturingDate: '',
    batchNo: '',
    lotNo: '',
    manufacturedBy: '',
    
    // Offer
    sku: '',
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    trackQuantity: true,
    quantity: '',
    
    // Safety & Compliance
    safetyWarnings: '',
    complianceInfo: '',
    certifications: [],

    // Added fields
    customAttributes: [{ key: '', value: '' }],
    options: [''],
    variations: [''],
    units: '',
    weight: '',
    modifiers: [''],
    vendor: '',
    gtin: ''
    ,unitStrength: '',
    packageSize: ''
  });

  // Prefill form when arriving from ItemLibrary with route state
  useEffect(() => {
    if (!prefillItem) return;
    setFormData(prev => ({
      ...prev,
      name: prefillItem.name || prev.name,
      category: prefillItem.category || prev.category,
      location: prefillItem.locations || prev.location,
      sku: prefillItem.sku || prefillItem.uniqueId || prev.sku,
      price: typeof prefillItem.price === 'string'
        ? (prefillItem.price.match(/[0-9.,]+/)?.[0] || '').replace(/,/g, '')
        : (prefillItem.price ?? prev.price),
      quantity: typeof prefillItem.stock === 'number' ? String(prefillItem.stock) : (prefillItem.stock ?? prev.quantity),
      images: prefillItem.image ? [prefillItem.image] : prev.images,
    }));
  }, [prefillItem]);

  const steps = [
    {
      id: 1,
      title: 'Product Identity',
      isComplete: formData.name && formData.itemType,
      hasErrors: !formData.name || !formData.itemType
    },
    {
      id: 2,
      title: 'Description',
      isComplete: formData.description,
      hasErrors: !formData.description
    },
    {
      id: 3,
      title: 'Product Details',
      isComplete: formData.category,
      hasErrors: !formData.category
    },
    {
      id: 4,
      title: 'Offer',
      isComplete: formData.sku && formData.price,
      hasErrors: !formData.sku || !formData.price
    },
    {
      id: 5,
      title: 'Safety & Compliance',
      isComplete: true, // Optional step
      hasErrors: false
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/admin/dashboard/items/library');
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const validImages = [];
    const errors = [];

    files.forEach(file => {
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max 5MB)`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not a valid image`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        validImages.push({
          file,
          url: e.target.result,
          name: file.name
        });
        
        if (validImages.length === files.length - errors.length) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...validImages]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    if (errors.length > 0) {
      alert('Upload errors:\n' + errors.join('\n'));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Save logic here
    console.log('Saving item:', formData);
    handleClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProductIdentityStep formData={formData} onChange={handleInputChange} />;
      case 2:
        return <DescriptionStep 
          formData={formData} 
          onChange={handleInputChange} 
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
        />;
      case 3:
        return <ProductDetailsStep formData={formData} onChange={handleInputChange} />;
      case 4:
        return <OfferStep formData={formData} onChange={handleInputChange} />;
      case 5:
        return <SafetyComplianceStep formData={formData} onChange={handleInputChange} />;
      default:
        return null;
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);
  const canProceed = currentStepData?.isComplete;

  return (
    <div className={styles.wizardOverlay}>
      <div className={styles.wizardContainer}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={handleClose}>
            <IoCloseSharp />
          </button>
          <h1 className={styles.title}>
            {(itemId || prefillItem) ? 'Edit item' : 'Create item'}
          </h1>
          <div className={styles.headerActions}>
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className={styles.progressContainer}>
          <div className={styles.progressSteps}>
            {steps.map((step, index) => (
              <div key={step.id} className={styles.stepContainer}>
                <div 
                  className={`${styles.step} ${
                    step.id === currentStep ? styles.stepActive : ''
                  } ${step.isComplete ? styles.stepComplete : ''} ${
                    step.hasErrors ? styles.stepError : ''
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className={`${styles.stepNumber} ${
                    step.hasErrors ? styles.stepNumberError : ''
                  }`}>
                    {step.hasErrors ? <IoWarning /> : (step.isComplete ? '✓' : step.id)}
                  </div>
                  <div className={styles.stepInfo}>
                    <div className={styles.stepTitle}>{step.title}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`${styles.stepConnector} ${
                    step.isComplete ? styles.stepConnectorComplete : ''
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className={styles.content}>
          <div className={styles.stepContent}>
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button 
            className={styles.navButton}
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <IoChevronBack />
            Previous
          </button>
          
          <div className={styles.stepIndicator}>
            Step {currentStep} of {steps.length}
          </div>
          
          <button 
            className={`${styles.navButton} ${styles.navButtonPrimary}`}
            onClick={handleNext}
            disabled={currentStep === steps.length || !canProceed}
          >
            Next
            <IoChevronForward />
          </button>
        </div>
      </div>
    </div>
  );
};

// Amazon-style Field Component
const AmazonField = ({ label, required = false, helpText, children }) => (
  <div className={styles.amazonField}>
    <div className={styles.fieldHeader}>
      {required && <span className={styles.asterisk}>*</span>}
      <span className={styles.fieldLabel}>{label}</span>
      {helpText && (
        <div className={styles.helpIcon} data-tooltip={helpText}>
          i
        </div>
      )}
    </div>
    <div className={styles.fieldInput}>
      {children}
    </div>
  </div>
);

// Step Components
const ProductIdentityStep = ({ formData, onChange }) => (
  <div className={styles.stepForm}>
    <h2 className={styles.stepFormTitle}>Product Identity</h2>
    <p className={styles.stepFormDescription}>
      Enter the basic information that identifies your product.
    </p>

    <AmazonField 
      label="Item type" 
      required 
      helpText="Select the type of product you're selling"
    >
      <select 
        className={styles.input}
        value={formData.itemType}
        onChange={(e) => onChange('itemType', e.target.value)}
      >
        <option>Physical good</option>
        <option>Digital product</option>
        <option>Service</option>
      </select>
    </AmazonField>

    <AmazonField 
      label="Product name" 
      required 
      helpText="Enter the name customers will see"
    >
      <input
        type="text"
        className={styles.input}
        value={formData.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Enter product name"
      />
    </AmazonField>

    <AmazonField 
      label="Optional selling name" 
      helpText="Alternative name for marketing purposes"
    >
      <input
        type="text"
        className={styles.input}
        value={formData.optionalSellingName}
        onChange={(e) => onChange('optionalSellingName', e.target.value)}
        placeholder="Alternative name for selling"
      />
    </AmazonField>

    <AmazonField 
      label="Brand" 
      helpText="The brand or manufacturer of this product"
    >
      <input
        type="text"
        className={styles.input}
        value={formData.brand}
        onChange={(e) => onChange('brand', e.target.value)}
        placeholder="Enter brand name"
      />
    </AmazonField>

    <div className={styles.fieldRow}>
      <AmazonField 
        label="Unit strength" 
        helpText="Strength or potency per unit (e.g., 500mg, 10%)"
      >
        <input
          type="text"
          className={styles.input}
          value={formData.unitStrength}
          onChange={(e) => onChange('unitStrength', e.target.value)}
          placeholder="e.g., 500mg"
        />
      </AmazonField>
      <AmazonField 
        label="Package size" 
        helpText="Pack configuration (e.g., 10 tablets, 1 bottle)"
      >
        <input
          type="text"
          className={styles.input}
          value={formData.packageSize}
          onChange={(e) => onChange('packageSize', e.target.value)}
          placeholder="e.g., 10 tablets"
        />
      </AmazonField>
    </div>

    <AmazonField 
      label="Custom attributes" 
      helpText="Add any additional identifying attributes"
    >
      <div className={styles.bulletPoints}>
        {formData.customAttributes.map((attr, index) => (
          <div key={index} className={styles.fieldRow}>
            <input
              type="text"
              className={styles.input}
              value={attr.key}
              onChange={(e) => {
                const list = [...formData.customAttributes];
                list[index] = { ...list[index], key: e.target.value };
                onChange('customAttributes', list);
              }}
              placeholder={`Attribute ${index + 1} name`}
            />
            <input
              type="text"
              className={styles.input}
              value={attr.value}
              onChange={(e) => {
                const list = [...formData.customAttributes];
                list[index] = { ...list[index], value: e.target.value };
                onChange('customAttributes', list);
              }}
              placeholder="Value"
            />
          </div>
        ))}
        <button 
          className={styles.addButton}
          onClick={() => onChange('customAttributes', [...formData.customAttributes, { key: '', value: '' }])}
        >
          Add attribute
        </button>
      </div>
    </AmazonField>
  </div>
);

const DescriptionStep = ({ formData, onChange, onImageUpload, onRemoveImage }) => (
  <div className={styles.stepForm}>
    <h2 className={styles.stepFormTitle}>Description</h2>
    <p className={styles.stepFormDescription}>
      Provide detailed information about your product to help customers understand what you're selling.
    </p>

    <AmazonField 
      label="Product description" 
      required 
      helpText="Detailed description that customers will see"
    >
      <textarea
        className={styles.textarea}
        rows="6"
        value={formData.description}
        onChange={(e) => onChange('description', e.target.value)}
        placeholder="Describe your product in detail..."
      />
    </AmazonField>

    <AmazonField 
      label="Key features (bullet points)" 
      helpText="Highlight the main benefits and features"
    >
      <div className={styles.bulletPoints}>
        {formData.bulletPoints.map((point, index) => (
          <input
            key={index}
            type="text"
            className={styles.input}
            value={point}
            onChange={(e) => {
              const newPoints = [...formData.bulletPoints];
              newPoints[index] = e.target.value;
              onChange('bulletPoints', newPoints);
            }}
            placeholder={`Feature ${index + 1}`}
          />
        ))}
        <button 
          className={styles.addButton}
          onClick={() => onChange('bulletPoints', [...formData.bulletPoints, ''])}
        >
          Add feature
        </button>
      </div>
    </AmazonField>

    <AmazonField 
      label="Images" 
      helpText="Upload high-quality images of your product (max 5MB each)"
    >
      <div className={styles.imageUploadContainer}>
        <div className={styles.imageUploadHeader}>
          <div className={styles.uploadInfo}>
            <span className={styles.infoIcon}>i</span>
            <span className={styles.uploadText}>
              <strong>Upload multiple files</strong> or drag and drop 1 or more files below.
            </span>
            <a href="#" className={styles.guidelineLink}>Product images style guideline</a>
          </div>
        </div>
        <div className={styles.uploadStatus}>
          Uploaded: {formData.images.length} of 4 images. Maximum 4 images are allowed. You can arrange the order after uploading.
        </div>
        <div className={styles.imageGrid}>
          {Array.from({ length: 4 }, (_, index) => {
            const hasImage = formData.images[index];
            return (
              <div key={index} className={styles.imageSlot}>
                {hasImage ? (
                  <div className={styles.imagePreview}>
                    <img src={hasImage.url} alt={`Product ${index + 1}`} />
                    <button 
                      className={styles.removeImageButton}
                      onClick={() => onRemoveImage(index)}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadSlot}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageUpload}
                      style={{ display: 'none' }}
                      id={`imageUpload${index}`}
                    />
                    <label htmlFor={`imageUpload${index}`} className={styles.uploadLabel}>
                      <div className={styles.cameraIcon}>📷</div>
                      <div className={styles.uploadButtonText}>Upload</div>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AmazonField>

    {/* Custom Attributes */}
    <AmazonField 
      label="Custom attributes" 
      helpText="Add custom key/value attributes for this item"
    >
      <div className={styles.bulletPoints}>
        {formData.customAttributes.map((attr, index) => (
          <div key={index} className={styles.fieldRow}>
            <input
              type="text"
              className={styles.input}
              value={attr.key}
              onChange={(e) => {
                const list = [...formData.customAttributes];
                list[index] = { ...list[index], key: e.target.value };
                onChange('customAttributes', list);
              }}
              placeholder={`Attribute ${index + 1} name`}
            />
            <input
              type="text"
              className={styles.input}
              value={attr.value}
              onChange={(e) => {
                const list = [...formData.customAttributes];
                list[index] = { ...list[index], value: e.target.value };
                onChange('customAttributes', list);
              }}
              placeholder="Value"
            />
          </div>
        ))}
        <button 
          className={styles.addButton}
          onClick={() => onChange('customAttributes', [...formData.customAttributes, { key: '', value: '' }])}
        >
          Add attribute
        </button>
      </div>
    </AmazonField>

    {/* Options */}
    <AmazonField 
      label="Options" 
      helpText="General options (e.g., size, color groups)"
    >
      <div className={styles.bulletPoints}>
        {formData.options.map((opt, index) => (
          <input
            key={index}
            type="text"
            className={styles.input}
            value={opt}
            onChange={(e) => {
              const list = [...formData.options];
              list[index] = e.target.value;
              onChange('options', list);
            }}
            placeholder={`Option ${index + 1}`}
          />
        ))}
        <button 
          className={styles.addButton}
          onClick={() => onChange('options', [...formData.options, ''])}
        >
          Add option
        </button>
      </div>
    </AmazonField>

    {/* Variations */}
    <AmazonField 
      label="Variations" 
      helpText="Specific variants (e.g., Red / Large)"
    >
      <div className={styles.bulletPoints}>
        {formData.variations.map((v, index) => (
          <input
            key={index}
            type="text"
            className={styles.input}
            value={v}
            onChange={(e) => {
              const list = [...formData.variations];
              list[index] = e.target.value;
              onChange('variations', list);
            }}
            placeholder={`Variation ${index + 1}`}
          />
        ))}
        <button 
          className={styles.addButton}
          onClick={() => onChange('variations', [...formData.variations, ''])}
        >
          Add variation
        </button>
      </div>
    </AmazonField>

    {/* Units */}
    <AmazonField 
      label="Units" 
      helpText="Unit of measure (e.g., pcs, box, bottle)"
    >
      <input
        type="text"
        className={styles.input}
        value={formData.units}
        onChange={(e) => onChange('units', e.target.value)}
        placeholder="e.g., pcs, box, bottle"
      />
    </AmazonField>

    {/* Weight */}
    <AmazonField 
      label="Weight" 
      helpText="Product weight (include unit, e.g., 500g, 1.5kg)"
    >
      <input
        type="text"
        className={styles.input}
        value={formData.weight}
        onChange={(e) => onChange('weight', e.target.value)}
        placeholder="e.g., 500g or 1.5kg"
      />
    </AmazonField>

    {/* Modifiers */}
    <AmazonField 
      label="Modifiers" 
      helpText="Add modifiers (e.g., add-ons, extras)"
    >
      <div className={styles.bulletPoints}>
        {formData.modifiers.map((m, index) => (
          <input
            key={index}
            type="text"
            className={styles.input}
            value={m}
            onChange={(e) => {
              const list = [...formData.modifiers];
              list[index] = e.target.value;
              onChange('modifiers', list);
            }}
            placeholder={`Modifier ${index + 1}`}
          />
        ))}
        <button 
          className={styles.addButton}
          onClick={() => onChange('modifiers', [...formData.modifiers, ''])}
        >
          Add modifier
        </button>
      </div>
    </AmazonField>
  </div>
);

const ProductDetailsStep = ({ formData, onChange }) => (
  <div className={styles.stepForm}>
    <h2 className={styles.stepFormTitle}>Product Details</h2>
    <p className={styles.stepFormDescription}>
      Specify the technical details and categorization for your product.
    </p>

    <AmazonField 
      label="Category" 
      required 
      helpText="Select the product category for proper classification"
    >
      <select 
        className={styles.input}
        value={formData.category}
        onChange={(e) => onChange('category', e.target.value)}
      >
        <option value="">Select category</option>
        <option>Medicine</option>
        <option>Health & Wellness</option>
        <option>Personal Care</option>
        <option>Baby Care</option>
      </select>
    </AmazonField>

    <div className={styles.fieldRow}>
      <AmazonField 
        label="Expiry Date" 
        helpText="Product expiration date"
      >
        <input
          type="date"
          className={styles.input}
          value={formData.expiryDate}
          onChange={(e) => onChange('expiryDate', e.target.value)}
        />
      </AmazonField>
      <AmazonField 
        label="Manufacturing Date" 
        helpText="Date when the product was manufactured"
      >
        <input
          type="date"
          className={styles.input}
          value={formData.manufacturingDate}
          onChange={(e) => onChange('manufacturingDate', e.target.value)}
        />
      </AmazonField>
    </div>

    <div className={styles.fieldRow}>
      <AmazonField 
        label="Batch No" 
        helpText="Manufacturing batch identification number"
      >
        <input
          type="text"
          className={styles.input}
          value={formData.batchNo}
          onChange={(e) => onChange('batchNo', e.target.value)}
          placeholder="Enter batch number"
        />
      </AmazonField>
      <AmazonField 
        label="Lot No" 
        helpText="Manufacturing lot identification number"
      >
        <input
          type="text"
          className={styles.input}
          value={formData.lotNo}
          onChange={(e) => onChange('lotNo', e.target.value)}
          placeholder="Enter lot number"
        />
      </AmazonField>
    </div>

    <AmazonField 
      label="Manufactured By" 
      helpText="Company or entity that manufactured this product"
    >
      <input
        type="text"
        className={styles.input}
        value={formData.manufacturedBy}
        onChange={(e) => onChange('manufacturedBy', e.target.value)}
        placeholder="Enter manufacturer name"
      />
    </AmazonField>

    <AmazonField 
      label="Vendor" 
      helpText="Supplier or vendor for this product"
    >
      <input
        type="text"
        className={styles.input}
        value={formData.vendor}
        onChange={(e) => onChange('vendor', e.target.value)}
        placeholder="Enter vendor name"
      />
    </AmazonField>

    <div className={styles.fieldRow}>
      <AmazonField 
        label="GTIN" 
        helpText="Global Trade Item Number (UPC/EAN/ISBN) if applicable"
      >
        <input
          type="text"
          className={styles.input}
          value={formData.gtin}
          onChange={(e) => onChange('gtin', e.target.value)}
          placeholder="Enter GTIN (UPC/EAN/ISBN)"
        />
      </AmazonField>
      <AmazonField 
        label="SKU" 
        helpText="Stock Keeping Unit identifier"
      >
        <input
          type="text"
          className={styles.input}
          value={formData.sku}
          onChange={(e) => onChange('sku', e.target.value)}
          placeholder="Enter SKU"
        />
      </AmazonField>
    </div>
  </div>
);

const OfferStep = ({ formData, onChange }) => (
  <div className={styles.stepForm}>
    <h2 className={styles.stepFormTitle}>Offer</h2>
    <p className={styles.stepFormDescription}>
      Set your pricing and inventory information.
    </p>

    <AmazonField 
      label="SKU" 
      required 
      helpText="Stock Keeping Unit - unique identifier for this product"
    >
      <input
        type="text"
        className={styles.input}
        value={formData.sku}
        onChange={(e) => onChange('sku', e.target.value)}
        placeholder="Enter SKU"
      />
    </AmazonField>

    <div className={styles.fieldRow}>
      <AmazonField 
        label="Price" 
        required 
        helpText="The selling price for this product"
      >
        <input
          type="number"
          className={styles.input}
          value={formData.price}
          onChange={(e) => onChange('price', e.target.value)}
          placeholder="0.00"
          step="0.01"
        />
      </AmazonField>
      <AmazonField 
        label="Compare at price" 
        helpText="Original price to show discount (optional)"
      >
        <input
          type="number"
          className={styles.input}
          value={formData.compareAtPrice}
          onChange={(e) => onChange('compareAtPrice', e.target.value)}
          placeholder="0.00"
          step="0.01"
        />
      </AmazonField>
    </div>

    <AmazonField 
      label="Cost per item" 
      helpText="Your cost for this product (for profit calculation)"
    >
      <input
        type="number"
        className={styles.input}
        value={formData.costPerItem}
        onChange={(e) => onChange('costPerItem', e.target.value)}
        placeholder="0.00"
        step="0.01"
      />
    </AmazonField>

    <AmazonField 
      label="Inventory tracking" 
      helpText="Enable quantity tracking for this product"
    >
      <div className={styles.checkboxField}>
        <input
          type="checkbox"
          id="trackQuantity"
          checked={formData.trackQuantity}
          onChange={(e) => onChange('trackQuantity', e.target.checked)}
        />
        <label htmlFor="trackQuantity">Track quantity</label>
      </div>
    </AmazonField>

    {formData.trackQuantity && (
      <AmazonField 
        label="Quantity" 
        helpText="Current stock quantity available"
      >
        <input
          type="number"
          className={styles.input}
          value={formData.quantity}
          onChange={(e) => onChange('quantity', e.target.value)}
          placeholder="0"
        />
      </AmazonField>
    )}
  </div>
);

const SafetyComplianceStep = ({ formData, onChange }) => (
  <div className={styles.stepForm}>
    <h2 className={styles.stepFormTitle}>Safety & Compliance</h2>
    <p className={styles.stepFormDescription}>
      Add any safety warnings or compliance information for your product.
    </p>

    <AmazonField 
      label="Safety warnings" 
      helpText="Important safety information for customers"
    >
      <textarea
        className={styles.textarea}
        rows="4"
        value={formData.safetyWarnings}
        onChange={(e) => onChange('safetyWarnings', e.target.value)}
        placeholder="Enter any safety warnings or precautions..."
      />
    </AmazonField>

    <AmazonField 
      label="Compliance information" 
      helpText="Regulatory compliance and certification details"
    >
      <textarea
        className={styles.textarea}
        rows="4"
        value={formData.complianceInfo}
        onChange={(e) => onChange('complianceInfo', e.target.value)}
        placeholder="Enter regulatory compliance information..."
      />
    </AmazonField>

    <div className={styles.completionMessage}>
      <h3>🎉 Almost done!</h3>
      <p>Review your information and click Save to create your product.</p>
    </div>
  </div>
);

export default ItemWizard;
