#!/bin/bash

# 需要更新的文件列表
files=(
    "card6.html"
    "card7.html"
    "card8.html"
    "cb1.html"
    "cb2.html"
    "cb3.html"
    "cb4.html"
    "cb5.html"
    "cb6.html"
    "cb7.html"
    "cb8.html"
    "cp1.html"
    "cp2.html"
    "cp3.html"
    "cp4.html"
    "cp5.html"
    "cs.html"
    "cs2.html"
    "cs3.html"
    "cs4.html"
    "cs5.html"
)

# 星星評分HTML模板
star_rating_html='                    <div id="star-rating" class="star-rating">
                        <span class="star" data-rating="1">☆</span>
                        <span class="star" data-rating="2">☆</span>
                        <span class="star" data-rating="3">☆</span>
                        <span class="star" data-rating="4">☆</span>
                        <span class="star" data-rating="5">☆</span>
                    </div>
                    <input type="hidden" id="rating" name="rating" value="">
                    <p id="rating-text" class="rating-feedback">請選擇評分</p><br>'

# JavaScript模板
js_template='    <script src="star-rating.js" defer></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            initStarRating();
            
            const reviewForm = document.getElementById("reviewForm");
            if (reviewForm) {
                reviewForm.addEventListener("submit", function(event) {
                    event.preventDefault();
                    
                    if (!validateRating()) {
                        alert("請選擇評分（1-5星）");
                        return;
                    }
                    
                    const comment = document.getElementById("comment").value.trim();
                    if (!comment) {
                        alert("請輸入評論內容");
                        return;
                    }
                    
                    alert("評論已提交！");
                    this.reset();
                    resetStarRating();
                });
            }
        });
    </script>'

echo "開始批量更新星星評分系統..."

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "正在更新 $file..."
        
        # 檢查文件是否包含舊的評分系統
        if grep -q 'option value="5">5 Stars' "$file"; then
            # 使用Python進行更複雜的文本替換
            python3 << EOF
import re

with open('$file', 'r', encoding='utf-8') as f:
    content = f.read()

# 替換評分下拉選單
pattern = r'<select id="rating" name="rating">.*?</select><br>'
replacement = '''$star_rating_html'''

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# 添加JavaScript
if 'star-rating.js' not in content:
    content = content.replace('<script src="card.js" defer></script>', 
                             '<script src="card.js" defer></script>\n$js_template')

with open('$file', 'w', encoding='utf-8') as f:
    f.write(content)
EOF
            echo "已完成更新 $file"
        else
            echo "文件 $file 已經更新過或不需要更新"
        fi
    else
        echo "文件 $file 不存在，跳過..."
    fi
done

echo "批量更新完成！" 