import os

import xlsxwriter
import json

directory = './output'
if not os.path.exists(directory):
    os.makedirs(directory)

inputJson = json.loads(open('input/краски.json', 'r', encoding='utf-8').read())
for menu in inputJson:
    for key, value in menu.items():
        print()
        print('[', key, ']')
        # create folder output/{key}
        for key1, value1 in value.items():
            print('[', key1, ']')
            # create excel file in output/{key} folder with {key1}.xlsx name
            for key2, value2 in value1.items():
                print('[', key2, ']')
                # create new worksheet in above excel file with the name {key2}
                for item in value2:
                    print(item['name'], item['value'])
                    # add fields in the current worksheet with the table caption {name} and field {value}

# Create an new Excel file and add a worksheet.
workbook = xlsxwriter.Workbook(directory + '/test.xlsx')
worksheet = workbook.add_worksheet('Стройматериалы')
worksheet2 = workbook.add_worksheet('Стройматериалы2')

# Widen the first column to make the text clearer.
worksheet.set_column('A:A', 20)

# Add a bold format to use to highlight cells.
bold = workbook.add_format({'bold': True})

# Write some simple text.
worksheet.write('A1', 'Hello')

# Text with formatting.
worksheet.write('A2', 'World', bold)

# Write some numbers, with row/column notation.
worksheet.write(2, 0, 123)
worksheet.write(3, 0, 123.456)

# Insert an image.
worksheet.insert_image('B5', 'logo.png')

workbook.close()
