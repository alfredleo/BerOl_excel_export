# -*- coding: utf-8 -*-
import os
import xlsxwriter
import json


def create_dir(directory_to_create):
    """
    Creates directory if it does not exist
    :rtype: bool
    """
    if not os.path.exists(directory_to_create):
        os.makedirs(directory_to_create)
        return True
    else:
        return False


out = './output/'
input_json = './input/'
create_dir(out)
create_dir(input_json)
workbooks = {}
for file in os.listdir(input_json):
    if file.endswith(".json"):
        json_file = os.path.join(input_json, file)
        inputJson = json.loads(open(json_file, 'r', encoding='utf-8').read())
        for menu in inputJson:
            for key, value in menu.items():
                print()
                print('[', key, ']')
                # create folder output/{key}
                create_dir(out + key)
                for key1, value1 in value.items():
                    print('[', key1, ']')
                    # create excel file in output/{key} folder with {key1}.xlsx name
                    path = out + key + '/' + key1 + '.xlsx'
                    # check if workbook already created
                    if path in workbooks.keys():
                        w = workbooks[path]
                    else:
                        w = workbooks[path] = xlsxwriter.Workbook(path)
                    # add formatting
                    headerFormat = w.add_format()
                    headerFormat.set_align('center')
                    headerFormat.set_align('vcenter')
                    headerFormat.set_bold(True)
                    headerFormat.set_italic(True)
                    dumpRows = 20
                    for key2, value2 in value1.items():
                        print('[', key2, ']')
                        # create new worksheet in above excel file with the name {key2}
                        worksheet = w.get_worksheet_by_name(key2[:31])
                        if worksheet is None:
                            worksheet = w.add_worksheet(key2[:31])
                        for i in range(1, dumpRows + 1):
                            worksheet.write(0, i, "[Товар %s]" % i, headerFormat)
                    max1 = 0
                    max2 = 0
                    for idx, item in enumerate(value2):
                        print(item['name'], item['value'])
                        # get max field size
                        if (len(item['name'])) > max1:
                            max1 = len(item['name'])
                        if (len(item['value'])) > max2:
                            max2 = len(item['value'])
                        # add fields in the current worksheet with the table caption {name} and field {value}
                        worksheet.write(idx + 1, 0, item['name'], headerFormat)
                        worksheet.write(idx + 1, 1, item['value'])
                    worksheet.set_column(1, 0, max1 + 4)
                    worksheet.set_column(1, dumpRows, max2 + 3)
                    worksheet.set_row(0, 33)
                    worksheet.insert_image('A1', './input/berol.png', {'x_offset': (max1 + 3) * 3, 'y_offset': 5})

        for key, workbook in workbooks.items():
            print(key)
            workbook.close()

# Insert an image.
# worksheet.insert_image('B5', 'logo.png')
