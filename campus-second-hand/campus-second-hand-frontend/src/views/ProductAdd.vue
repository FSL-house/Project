<template>
  <div class="page-container">
    <section class="page-section">
      <div class="section-head">
        <div>
          <h1 class="page-title">发布商品</h1>
          <p class="page-subtitle">支持填写商品基础信息、上传图片并生成预览，适合作为完整业务流程中的发布入口。</p>
        </div>
      </div>
    </section>

    <section class="page-section form-grid">
      <div class="surface surface-pad">
        <el-form :model="form" label-width="92px">
          <el-form-item label="商品标题">
            <el-input v-model="form.title" placeholder="例如：九成新 Java 教材、闲置台灯、二手耳机" />
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input-number v-model="form.price" :min="0" :precision="2" :step="1" style="width: 220px" />
          </el-form-item>

          <el-form-item label="商品分类">
            <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 220px">
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="图片地址">
            <el-input v-model="form.image" placeholder="可手动填写 /images/xxx.jpg，也可通过下方上传自动生成" />
          </el-form-item>

          <el-form-item label="上传图片">
            <div class="upload-wrapper">
              <el-upload
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                accept="image/*"
                @change="handleSelectImage"
              >
                <el-button>选择图片</el-button>
              </el-upload>
              <el-button type="primary" :loading="uploading" @click="handleUploadImage">上传图片</el-button>
              <span class="upload-tip">{{ selectedFileName || '暂未选择图片' }}</span>
            </div>
          </el-form-item>

          <el-form-item label="商品描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="7"
              placeholder="建议填写商品成色、购买时间、是否有包装、是否支持当面验货等信息"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" @click="handleSubmit">提交发布</el-button>
            <el-button size="large" @click="router.push('/products')">返回广场</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="surface surface-pad preview-panel">
        <div class="preview-head">
          <h3>发布预览</h3>
          <p>提前检查图片、标题、价格和描述，避免发布后信息不完整。</p>
        </div>

        <img :src="previewImage" alt="商品预览图" class="preview-image" />

        <div class="preview-title">{{ form.title || '这里会显示商品标题' }}</div>
        <div class="preview-price">{{ formatPrice(form.price) }}</div>

        <div class="preview-meta">
          <span>{{ currentCategoryName }}</span>
          <span>{{ form.image || '等待上传商品图片' }}</span>
        </div>

        <div class="preview-desc">{{ form.description || '这里会显示商品描述。建议说明商品成色、购买时间、转让原因和交易方式。' }}</div>

        <div class="tips-box">
          <div class="tips-title">发布建议</div>
          <ul>
            <li>标题尽量明确，例如“95 新充电宝”比“便宜卖”更容易被搜索到。</li>
            <li>图片建议使用实拍图，发布前先确认能正常预览。</li>
            <li>描述里补充成色、交易地点和可交易时间，转化率会更高。</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { uploadProductImage } from '../api/file'
import { addProduct, getCategoryList } from '../api/product'
import { formatPrice } from '../utils/display'
import { resolveProductImage } from '../utils/image'

const router = useRouter()
const categoryList = ref([])
const selectedFile = ref(null)
const selectedFileName = ref('')
const uploading = ref(false)

const form = reactive({
  title: '',
  description: '',
  price: 0,
  image: '',
  categoryId: ''
})

const currentCategoryName = computed(() => {
  const matched = categoryList.value.find((item) => item.id === form.categoryId)
  return matched?.name || '未选择分类'
})

const previewImage = computed(() => resolveProductImage(form.image, form.title || '商品图片', 'card'))

async function loadCategories() {
  const res = await getCategoryList()
  categoryList.value = res.data
}

// 选择图片后，先把文件保存到页面状态中，等用户点击上传。
function handleSelectImage(uploadFile) {
  const file = uploadFile.raw

  if (!file) {
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 5MB')
    selectedFile.value = null
    selectedFileName.value = ''
    return
  }

  selectedFile.value = file
  selectedFileName.value = uploadFile.name
}

// 调用后端上传接口，把图片保存到前端 public/images 目录。
async function handleUploadImage() {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择图片')
    return
  }

  uploading.value = true
  try {
    const res = await uploadProductImage(selectedFile.value)
    form.image = res.data
    selectedFileName.value = `已上传：${selectedFileName.value}`
    ElMessage.success('图片上传成功')
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  if (selectedFile.value && !form.image) {
    await handleUploadImage()
  }

  if (!form.image) {
    ElMessage.warning('请先上传图片，或者手动填写图片地址')
    return
  }

  await addProduct(form)
  ElMessage.success('发布成功，等待管理员审核')
  router.push('/products')
}

onMounted(loadCategories)
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 20px;
}

.upload-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.upload-tip {
  color: #667085;
  font-size: 14px;
}

.preview-panel {
  display: flex;
  flex-direction: column;
}

.preview-head h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.preview-head p {
  margin: 8px 0 0;
  color: #667085;
  line-height: 1.7;
}

.preview-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  margin-top: 18px;
  border-radius: 14px;
  background: #f8fafc;
}

.preview-title {
  margin-top: 18px;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.preview-price {
  margin-top: 10px;
  font-size: 34px;
  font-weight: 800;
  color: #f56c6c;
}

.preview-meta {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #667085;
  word-break: break-all;
}

.preview-desc {
  margin-top: 16px;
  line-height: 1.9;
  color: #475467;
  white-space: pre-wrap;
}

.tips-box {
  margin-top: auto;
  padding-top: 20px;
}

.tips-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.tips-box ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #667085;
  line-height: 1.9;
}

@media (max-width: 980px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
