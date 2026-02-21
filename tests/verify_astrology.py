#!/usr/bin/env python3
"""
驗證星盤計算準確度
對比：https://astrolabe.astroinfo.com.tw/ (唐綺陽星盤)
"""
import sys
sys.path.insert(0, '/home/chunghuikai/.openclaw/workspace/selfkit-backend')

from app.infrastructure.astrology import calculate_precise_chart
from app.infrastructure.ziwei import calculate_ziwei_chart

# 測試資料
TEST_CASES = [
    {"id": 1, "date": "1990-01-15", "time": "08:30", "place": "台北"},
    {"id": 2, "date": "1985-06-21", "time": "14:00", "place": "台北"},
    {"id": 3, "date": "1995-12-25", "time": "00:15", "place": "台北"},
    {"id": 4, "date": "1988-03-08", "time": "22:45", "place": "台北"},
    {"id": 5, "date": "1992-09-10", "time": "06:00", "place": "台北"},
    {"id": 6, "date": "1978-11-30", "time": "12:00", "place": "台北"},
    {"id": 7, "date": "2000-02-29", "time": "10:30", "place": "台北"},
    {"id": 8, "date": "1983-07-04", "time": "16:20", "place": "台北"},
    {"id": 9, "date": "1997-04-18", "time": "03:45", "place": "台北"},
    {"id": 10, "date": "1970-08-22", "time": "19:00", "place": "台北"},
]

def calculate_all():
    """計算所有測試案例"""
    print("=" * 60)
    print("knowyourself 星盤計算結果")
    print("=" * 60)
    
    for case in TEST_CASES:
        print(f"\n--- Case {case['id']}: {case['date']} {case['time']} ---")
        
        # 西洋星盤
        western = calculate_precise_chart(
            case['date'], case['time'], 
            25.033, 121.565, 'Asia/Taipei'
        )
        
        print(f"太陽: {western.get('sun', {}).get('sign')} {western.get('sun', {}).get('degree'):.2f}°")
        print(f"月亮: {western.get('moon', {}).get('sign')} {western.get('moon', {}).get('degree'):.2f}°")
        print(f"上升: {western.get('ascendant', {}).get('sign')} {western.get('ascendant', {}).get('degree'):.2f}°")
        
        # 紫微斗數
        ziwei = calculate_ziwei_chart(case['date'], case['time'])
        print(f"農曆: {ziwei.get('lunar_date')}")
        print(f"命宮: {ziwei.get('ming_gong', {}).get('branch')}")
        print(f"五行局: {ziwei.get('wu_xing_ju')}")

if __name__ == "__main__":
    calculate_all()
