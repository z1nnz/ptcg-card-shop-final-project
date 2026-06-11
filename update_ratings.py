#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re

# 需要更新的文件列表
files = [
    "card6.html", "card7.html", "card8.html",
    "cb1.html", "cb2.html", "cb3.html", "cb4.html", "cb5.html", "cb6.html", "cb7.html", "cb8.html",
    "cp1.html", "cp2.html", "cp3.html", "cp4.html", "cp5.html",
    "cs.html", "cs2.html", "cs3.html", "cs4.html", "cs5.html"
]

# 星星評分HTML
star_rating_html = '''                    <div id="star-rating" class="star-rating">
                        <span class="star" data-rating="1">☆</span>
                        <span class="star" data-rating="2">☆</span>
                        <span class="star" data-rating="3">☆</span>
                        <span class="star" data-rating="4">☆</span>
                        <span class="star" data-rating="5">☆</span>
                    </div>
                    <input type="hidden" id="rating" name="rating" value="">
                    <p id="rating-text" class="rating-feedback">請選擇評分</p><br>'''

# JavaScript模板
js_template = '''    <script src="star-rating.js" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            initStarRating();
            
            const reviewForm = document.getElementById('reviewForm');
            if (reviewForm) {
                reviewForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    
                    if (!validateRating()) {
                        alert('請選擇評分（1-5星）');
                        return;
                    }
                    
                    const comment = document.getElementById('comment').value.trim();
                    if (!comment) {
                        alert('請輸入評論內容');
                        return;
                    }
                    
                    alert('評論已提交！');
                    this.reset();
                    resetStarRating();
                });
            }
        });
    </script>'''

def update_file(filename):
    """更新單個文件的評分系統"""
    if not os.path.exists(filename):
        print(f"文件 {filename} 不存在，跳過...")
        return False
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 檢查是否需要更新
        if 'option value="5">5 Stars' not in content:
            print(f"文件 {filename} 已經更新過或不需要更新")
            return False
        
        # 替換評分下拉選單
        pattern = r'<select id="rating" name="rating">.*?</select><br>'
        content = re.sub(pattern, star_rating_html, content, flags=re.DOTALL)
        
        # 添加JavaScript（如果還沒有的話）
        if 'star-rating.js' not in content:
            content = content.replace(
                '<script src="card.js" defer></script>',
                '<script src="card.js" defer></script>\n' + js_template
            )
        
        # 寫回文件
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"已完成更新 {filename}")
        return True
        
    except Exception as e:
        print(f"更新文件 {filename} 時出錯: {e}")
        return False

def main():
    """主函數"""
    print("開始批量更新星星評分系統...")
    
    updated_count = 0
    for filename in files:
        if update_file(filename):
            updated_count += 1
    
    print(f"\n批量更新完成！共更新了 {updated_count} 個文件。")

if __name__ == "__main__":
    main() 