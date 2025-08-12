
// const DOUBAO_SEEDREAM_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations ' // 豆包文生图API的URL

export const generateAvatar = async (
  prompt, // 用户提供的文本提示，用于生成图像
  api_url = '/api/doubao/images/generations', // 使用 Vite 代理路径来解决跨域
  api_key = import.meta.env.VITE_DOUBAO_API_KEY, // 替换为你的豆包API密钥（实际由代理添加）
  model = 'ep-20250812115635-bj7sx' // 使用特定的豆包文生图模型
) => {
  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 无需手动添加 Authorization，代理会处理
      },
      body: JSON.stringify({
        model: model, // 指定使用的模型
        prompt: prompt, // 提供的文本提示
        // 可能还需要其他参数，例如'image_size', 'style_preset'等，请根据文档添加
        // image_size: '1024x1024', // 示例参数，假设需要指定图像尺寸
        // style_preset: 'digital-art' // 示例参数，假设可以指定艺术风格
      })
    });
    
    if (!response.ok) {
      throw new Error('网络响应错误');
    }

    const data = await response.json();
    
    // 假设响应中包含生成图像的URL
    return {
      code: 0,
      data: {
        imageUrl: data.data[0].url // 根据实际返回的数据结构调整
      }
    };
  } catch (error) {
    console.error('生成图像时出错:', error);
    return {
      code: 1,
      msg: '生成图像时发生错误...',
    };
  }
};